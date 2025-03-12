document.addEventListener("DOMContentLoaded", function () {
    // Get current user from data attribute in the EJS file
    const currUser = document.body.getAttribute("data-user");

    if (currUser === "dean") {
        // Dean: Subject-wise Performance Pie Chart
        fetch("/analytics-data")
            .then(response => response.json())
            .then(({ subjectLabels, subjectDataValues }) => {
                new Chart(document.getElementById("subjectChart"), {
                    type: "pie",
                    data: {
                        labels: subjectLabels,
                        datasets: [{
                            label: "Average Marks",
                            data: subjectDataValues,
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"]
                        }]
                    }
                });
            })
            .catch(error => console.error("Error loading subject data:", error));
    } else {
        // Teacher: Student-wise Performance Bar Chart
        fetch("/analytics-data")
            .then(response => response.json())
            .then(({ studentLabels, studentDataValues }) => {
                new Chart(document.getElementById("studentChart"), {
                    type: "bar",
                    data: {
                        labels: studentLabels,
                        datasets: [{
                            label: "Marks Obtained",
                            data: studentDataValues,
                            backgroundColor: "#36A2EB"
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } }
                    }
                });
            })
            .catch(error => console.error("Error loading student data:", error));
    }
});
