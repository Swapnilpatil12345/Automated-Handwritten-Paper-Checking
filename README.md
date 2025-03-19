# Automated Handwritten Exam Grading System

## Overview
The **Automated Handwritten Exam Grading System** is designed to reduce the workload of examiners by automating the grading of handwritten exam answer sheets. This project streamlines the evaluation process using advanced AI models and a structured workflow.

---

## Features
- **Secure Authentication**: Teachers must register and log in to ensure the security of exam data.
- **Student and Exam Management**: Teachers can add details about students, exams, and subjects, stored securely in a MongoDB database.
- **Ideal Answer Sheet Upload**: Teachers upload the ideal answer sheet in image format, which is processed to extract handwritten text.
- **Student Answer Sheet Processing**: Teachers upload student answer sheets, which are similarly processed for handwritten text extraction.
- **Automated Grading**: Student answers are compared to the ideal answers, and marks are assigned using AI-powered evaluation.
- **Data Persistence**: All extracted data and results are stored securely in MongoDB.

---

## Workflow
1. **Teacher Registration and Login**: Ensures secure access to exam data.
2. **Data Entry**: Teachers provide details about students, exams, and subjects.
3. **Ideal Answer Sheet Upload**: 
   - The system uses **Microsoft's `phi-3.5-vision-instruct`** model to extract handwritten text from the ideal answer sheet.
   - Extracted text is stored in the MongoDB database.
4. **Student Answer Sheet Upload**:
   - Handwritten text is extracted using the same model and stored in the database.
5. **Grading**:
   - The system uses **NVIDIA's `llama-3.1-nemotron-70b-instruct`** model to evaluate student answers against the ideal answers.
   - Marks are assigned and stored in the database.

---

**Example Prompt to Llama Model**

You are an AI exam evaluator. Compare the following student answer with the model answer.  
Assign marks out of 10 based on correctness, completeness, and clarity.  
Provide a brief explanation for the grading.  

Model Answer: "Newton's first law states that an object at rest stays at rest unless acted upon by an external force."  

Student Answer: "Newton's first law says that things keep doing what they were doing unless something changes it."  

Evaluate and assign marks.

Expected AI Output
Marks: 7/10  
Feedback: "The student answer correctly captures the essence of Newton's First Law but lacks precision.  
Using scientific terms like 'object' and 'external force' would improve accuracy."  
---

## Tech Stack
### Frontend
- **HTML**, **CSS**, **EJS**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB**

### APIs and Models
- **Microsoft's `phi-3.5-vision-instruct`**: Handwritten text extraction.
- **NVIDIA's `llama-3.1-nemotron-70b-instruct`**: AI-based grading.

### Tools
- **Postman**: For API testing and authentication.
- **MVC Architecture**: Ensures clean and maintainable code.
- **REST APIs**: Used for communication between frontend and backend.

---

## Installation and Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/atharvviit26/Automated-Handwritten-Exam-Grading-System
   cd Automated-Handwritten-Exam-Grading-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=<your-mongodb-uri>
   API_KEY_MICROSOFT=<microsoft-api-key>
   API_KEY_NVIDIA=<nvidia-api-key>
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

---

## Usage
1. **Register and Login**:
   - Navigate to the registration page and create an account.
   - Log in to access the dashboard.

2. **Add Student and Exam Details**:
   - Fill out the form to add student, exam, and subject details.

3. **Upload Answer Sheets**:
   - Upload the ideal answer sheet and student answer sheets as images.

4. **Automated Grading**:
   - The system will process the answer sheets and display the results.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## Acknowledgements
- **Microsoft** for the `phi-3.5-vision-instruct` model.
- **NVIDIA** for the `llama-3.1-nemotron-70b-instruct` model.
- All open-source contributors and tools used in this project.

---

## Contact
For any queries or feedback, please contact [Your Name/Email/LinkedIn].

