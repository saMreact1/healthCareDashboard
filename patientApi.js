// const axios = require('axios');
const jessicaDetails = document.getElementById('jessica');
const patientName = document.getElementById('patientName');
const patientImage = document.getElementById('patientImage');
const patientDOB = document.getElementById('patientDOB');
const patientGender = document.getElementById('patientGender');
const patientContact = document.getElementById('patientContact');
const patientEmergency = document.getElementById('patientEmergency');
const patientInsurance = document.getElementById('patientInsurance');

const respiratoryRate = document.getElementById('respiratoryRate');
const respiratoryStatus = document.getElementById('respiratoryStatus');
const heartRate = document.getElementById('heartRate');
const heartStatus = document.getElementById('heartStatus');
const temperature = document.getElementById('temperature');
const temperatureStatus = document.getElementById('temperatureStatus');

const table = document.getElementById('table');

const labResults = document.getElementById('labResults');

const graph = document.getElementById('myChart').getContext('2d');

//Basic Auth Encryption

function encodeCredentials(username, password) {
    const credentials = `${username}:${password}`;
    return btoa(credentials); // Base64 encode the credentials
}
const encryptedAuthKey = encodeCredentials('coalition', 'skills-test');



jessicaDetails.addEventListener('click', function (e) {
    e.preventDefault();
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://fedskillstest.coalitiontechnologies.workers.dev',
        headers: { 
            'Authorization': `Basic ${encryptedAuthKey}`
        }
    };
    
    axios.request(config)
        .then((response) => {
            let patientDetails = response.data[3];
            let patientDiagnosis = patientDetails.diagnosis_history[0];

            if (JSON.stringify(patientDetails)) {    // Patient details
                patientImage.src = patientDetails.profile_picture;
                patientImage.style.display = "block";
                patientName.innerHTML = patientDetails.name;

                let dob = JSON.stringify(patientDetails.date_of_birth);
                patientDOB.innerHTML = dateOfBirth(dob);

                patientGender.innerHTML = patientDetails.gender;
                patientContact.innerHTML = patientDetails.phone_number;
                patientEmergency.innerHTML = patientDetails.emergency_contact;
                patientInsurance.innerHTML = patientDetails.insurance_type;

                // Patient Diagnosis
                respiratoryRate.innerHTML = patientDiagnosis.respiratory_rate['value'] + ' ' + "bpm";
                respiratoryStatus.innerHTML = patientDiagnosis.respiratory_rate['levels'];
                temperature.innerHTML = patientDiagnosis.temperature['value'] + ' ' + "<span>&#8457;</span>";
                temperatureStatus.innerHTML = patientDiagnosis.temperature['levels'];
                heartRate.innerHTML = patientDiagnosis.heart_rate['value'] + ' ' + "bpm";
                heartRateStatus.innerHTML = '<img src="/assets/ArrowDown.svg">' + ' ' + patientDiagnosis.heart_rate['levels'];

                // Diagnostic Lists
                let patientDiagnosticLists = patientDetails.diagnostic_list;

                table.innerHTML += patientDiagnosticLists.map(list => 
                    `<tr>
                        <td>${list.name}</td>
                        <td>${list.description}</td>
                        <td>${list.status}</td>
                    </tr>`
                ).join("");

                // Lab Results
                let patientlabResults = patientDetails.lab_results;

                labResults.innerHTML += patientlabResults.map(resultList =>
                    `<span>
                        <p>${resultList}</p>
                        <img src="/assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="">
                    </span>`
                ).join("");

                // Patient chart
                let xValues = [];
                let yValues = [60, 80, 100,120,140,160,180];
                let chartList = patientDetails.diagnosis_history;
                let bloodPressure = patientDiagnosis.blood_pressure;

                console.log(bloodPressure.systolic['value']);

                for (let i = 0; i < chartList.length; i++) {
                    xValues.push(`${chartList[i].month.slice(0, 3)}, ${chartList[i].year}`)
                }
                console.log(xValues)

                // for (let i = 60; i <= 180; i + 20) {
                //     yValues.push([i])
                // }
                // console.log(yValues)
                // chartList.map(period => {
                //     if (period >= 2) {
                //         console.log("can't display more than 6 months")
                //     } else {
                //         xValues.push(`${period.month}, ${period.year}`)
                //     }
                // }).join("");

                new Chart(graph, {
                type: "line",
                data: {
                    labels: xValues, yValues,
                    datasets: [{ 
                    data: [2000,1140,1060,1060,1070,1110,1330,2210,7830,2478],
                    borderColor: "#8C6FE6",  //blue
                    fill: false
                    }, { 
                    data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
                    borderColor: "#C26EB4",   //purple
                    fill: false
                    }]
                },
                options: {
                    legend: {display: false}
                }
                });

            } else {
                console.log("Patient does not exist");
            }
    })
    .catch((error) => {
        console.log(error);
    });
});

// Function for formatted Date of Birth
function dateOfBirth(dob) {
    let options = { year: 'numeric', month: 'long', day: 'numeric'};

    // Create a Date object with the desired date
    let date = new Date(dob); // 'YYYY-MM-DD' format is recommended

    // Format the date using the specified options
    let formattedDate = date.toLocaleDateString("en-US", options);

    // Output the formatted date
    return formattedDate;
}