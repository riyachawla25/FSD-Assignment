const form = document.getElementById("requestForm");
const requestsContainer = document.getElementById("requestsContainer");


// Get all requests
async function getRequests() {

    const response = await fetch("/api/requests");

    const requests = await response.json();

    displayRequests(requests);
}


// Display requests
function displayRequests(requests) {

    requestsContainer.innerHTML = "";

    if (requests.length === 0) {
        requestsContainer.innerHTML =
            "<p>No requests submitted yet.</p>";
        return;
    }

    requests.forEach(request => {

        const card = document.createElement("div");

        card.className = "request-card";

        card.innerHTML = `
            <h3>Request #${request.id}</h3>

            <p><strong>Name:</strong> ${request.studentName}</p>

            <p><strong>Email:</strong> ${request.email}</p>

            <p><strong>Category:</strong> ${request.category}</p>

            <p><strong>Description:</strong> ${request.description}</p>

            <p><strong>Priority:</strong> ${request.priority}</p>

            <button onclick="editRequest(${request.id})">
                Edit
            </button>

            <button onclick="deleteRequest(${request.id})">
                Delete
            </button>
        `;

        requestsContainer.appendChild(card);
    });
}


// Submit new request
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const requestData = {

        studentName:
            document.getElementById("studentName").value,

        email:
            document.getElementById("email").value,

        category:
            document.getElementById("category").value,

        description:
            document.getElementById("description").value,

        priority:
            document.getElementById("priority").value
    };


    await fetch("/api/requests", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(requestData)
    });


    alert("Request submitted successfully!");

    form.reset();

    getRequests();
});


// Delete request
async function deleteRequest(id) {

    if (!confirm("Are you sure you want to delete this request?")) {
        return;
    }

    await fetch(`/api/requests/${id}`, {
        method: "DELETE"
    });

    alert("Request deleted successfully!");

    getRequests();
}


// Edit request
async function editRequest(id) {

    const response =
        await fetch(`/api/requests/${id}`);

    const request =
        await response.json();


    const studentName =
        prompt("Enter student name:", request.studentName);

    const email =
        prompt("Enter email:", request.email);

    const category =
        prompt("Enter category:", request.category);

    const description =
        prompt("Enter problem description:", request.description);

    const priority =
        prompt("Enter priority:", request.priority);


    if (!studentName || !email || !category ||
        !description || !priority) {
        return;
    }


    const updatedRequest = {

        studentName,
        email,
        category,
        description,
        priority
    };


    await fetch(`/api/requests/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedRequest)
    });


    alert("Request updated successfully!");

    getRequests();
}


// Load requests when page opens
getRequests();