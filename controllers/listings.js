const Listing = require('../models/listing.js');
const axios = require('axios');
const fs = require('fs');
const OpenAI = require('openai');
const mongoose = require('mongoose');

// Initialize OpenAI client
module.exports.fetchMarksForm = async(req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    res.render('listings/fetchMarks.ejs',{listing});
}

module.exports.summary = async(req,res)=>{
    let allListings = await Listing.find({});
    let Dean_ID = process.env.DEAN_ID;
    res.render('listings/summary.ejs', { allListings ,Dean_ID});
}

module.exports.fetchMarksProcess = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    try {
        let prompt = `Consider you are the examiner for Class ${listing.Class}, evaluating the Subject ${listing.Subject} paper, which has a maximum of ${listing.MaxMarks} marks.\nHere is the Ideal Answer Sheet for the exam: ${listing.IdealAnswerSheet.context} \nHere is the Student's Answer Sheet:${listing.StudentAnswerSheet.context} . \nAs the examiner, how many marks would you grade the student? Please provide only the numerical grade as the output.`

        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            stream: true,
        });

        // Stream the response back to the client
        let responseContent = '';
        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            responseContent += content;
            process.stdout.write(content);
        }

        // Send the response to the client
        let ans = responseContent.trim()
        let mks=""
        for(let i=0;i<ans.length;i++)
        {
            if(ans[i]=='*') continue;
            mks+=ans[i];
        }
        listing.MarksObtained = mks;
        await Listing.findByIdAndUpdate(id, listing);
        res.redirect(`/papers/${id}`);
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/papers');
    }
}

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

module.exports.showRoute = async (req, res) => {
    let { id } = req.params;

    let chk = await Listing.findById(id)
    
    if(!chk)
    {
        req.flash('error', 'Listing you requested doesnt exist');
        res.redirect('/papers');
    }
    
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let d = Date.now();
    let currDate = Math.round(d/day);


    const listing = await Listing.findById(id).populate('SubjectTeacher');
    if (!listing) {
        req.flash('error', 'Listing you requested doesnt exist');
        res.redirect('/papers');
    }
    res.render('listings/show.ejs', { listing ,currDate});
}

module.exports.createRoute = async (req, res) => {

    let { listing } = req.body;
    console.log(listing);

    const newListing = new Listing(listing);
    newListing.SubjectTeacher = req.user._id;
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let d = Date.now();
    newListing.Date = Math.round(d/day);

    let tp = await newListing.save();
    req.flash('success', 'New Listing Created!');

    let lst = await Listing.findById(tp._id.toString());
    if (!lst) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    let id = lst._id;

    console.log(lst);
    res.redirect(`/papers/${id}/idealanswersheet`);
}

module.exports.studentAnswerSheet = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    res.render('listings/studentanswersheet.ejs', { listing });
}

module.exports.studentAnswerSheetProcess = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }

    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath);

        listing.StudentAnswerSheet.url = req.file.path
        listing.StudentAnswerSheet.filename = req.file.filename

        const imageB64 = Buffer.from(fileContent).toString('base64');

        if (imageB64.length >= 180000) {
            req.flash('error', 'The size of Image is too big for processing');
            return res.redirect('/papers');
        }

        // Prepare the description
        const desc = `  
        Above is the answer sheet of a student. Just extract the text written in the image as it is.
        Don't explain as it is required to grade marks.
        `;

        let ApiKey = "Bearer ";
        ApiKey+=process.env.NVIDIA_API_KEY;
        // Set up the request payload
        const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        const headers = {
            "Authorization": ApiKey,
            "Accept": "application/json",
        };

        const payload = {
            model: 'microsoft/phi-3.5-vision-instruct',
            messages: [
                {
                    role: "user",
                    content: `${desc} <img src="data:image/jpeg;base64,${imageB64}" />`,
                },
            ],
            max_tokens: 512,
            temperature: 0.2,
        };


        const response = await axios.post(invokeUrl, payload, { headers });
        listing.StudentAnswerSheet.context = response.data['choices'][0]['message']['content'];
        await Listing.findByIdAndUpdate(id, listing)
        req.flash('success', 'Student Answer Sheet Processed Successfully');
        res.redirect(`/papers/${id}/fetchmarks`);

    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/papers');
    }
}

module.exports.studentIdealAnswerSheet = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    res.render('listings/studentidealanswersheet.ejs', { listing });
}

module.exports.studentIdealAnswerSheetProcess = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    try {
        listing.IdealAnswerSheet.url = req.file.path
        listing.IdealAnswerSheet.filename = req.file.filename
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath);

        const imageB64 = Buffer.from(fileContent).toString('base64');

        if (imageB64.length >= 180000) {
            req.flash('error', 'The size of Image is too big for processing');
            return res.redirect('/papers');
        }

        // Prepare the description
        const desc = `
        Above is the ideal Answersheet of a exam. Just extract the text written in the image as it is.
        Don't explain as it is required to grade marks.
        `;

        let ApiKey = "Bearer ";
        ApiKey+=process.env.NVIDIA_API_KEY;

        // Set up the request payload
        const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
        const headers = {
            "Authorization": ApiKey,
            "Accept": "application/json",
        };
// "model": `microsoft/phi-3.5-vision-instruct`,
        const payload = {
            model: 'meta/llama-3.2-90b-vision-instruct',
            messages: [
                {
                    role: "user",
                    content: `${desc} <img src="data:image/jpeg;base64,${imageB64}" />`,
                },
            ],
            max_tokens: 512,
            temperature: 0.2,
        };


        const response = await axios.post(invokeUrl, payload, { headers });
        listing.IdealAnswerSheet.context = response.data['choices'][0]['message']['content'];

        await Listing.findByIdAndUpdate(id, listing)
        req.flash('success', 'Ideal Answer Sheet Processed Successfully');
        res.redirect(`/papers/${id}/studentanswersheet`)  

    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/papers');
    }
}

module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    console.log({ listing });
    res.render('listings/edit.ejs', { listing });
}

module.exports.updateRoute = async (req, res) => {

    let { id } = req.params;
    let previous = await Listing.findById(id);

    console.log('Updation Started !! \n\n\n');
    let { listing } = req.body;

    console.log('New listing!!')
    console.log(listing);

    await Listing.findByIdAndUpdate(id, listing)
    req.flash('success', 'Edition Compleated!');
    res.redirect(`/papers/${id}/editnext`)
}

module.exports.editNext = async(req,res)=>{
    console.log('\n\nEntered! \n')
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/papers');
    }
    console.log(id);
    res.render('listings/editnext.ejs', {id});
}

module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    console.log(`Deleted id : ${id}`);
    res.redirect('/papers');
}