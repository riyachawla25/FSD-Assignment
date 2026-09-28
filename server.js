const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

http.createServer((req, res) => {

    
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <h1>Welcome to Student Record System</h1>

            <form action="/add-student" method="POST">
                Name: <input type="text" name="name" required><br><br>
                Roll No: <input type="text" name="roll" required><br><br>
                Course: <input type="text" name="course" required><br><br>
                Email: <input type="email" name="email" required><br><br>

                <button>Add Student</button>
            </form>

            <br>
            <a href="/students">View Students</a>
        `);
    }

    
    else if (req.url === "/add-student" && req.method === "POST")
         {

        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const student = querystring.parse(body);

            fs.readFile("students.json", "utf8", (err, data) => {

                let students = data ? JSON.parse(data) : [];

                students.push(student);

                fs.writeFile(
    "students.json",
    JSON.stringify(students, null, 2),
    () => {

        res.writeHead(200, { "Content-Type": "text/html" });

        res.end(`
            <h2>Student Added Successfully!</h2>
            <a href="/">Go Back</a> |
            <a href="/students">View Students</a>
        `);
    }
);
            });
        });
    }

    
    else if (req.url === "/students") {

        fs.readFile("students.json", "utf8", (err, data) => {

            let students = data ? JSON.parse(data) : [];

            let output = `
                <h1>Student Records</h1>
                <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Course</th>
                    <th>Email</th>
                </tr>
            `;

            students.forEach(s => {
                output += `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.roll}</td>
                        <td>${s.course}</td>
                        <td>${s.email}</td>
                    </tr>
                `;
            });

            output += `</table><br><a href="/">Add Student</a>`;

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(output);
        });
    }

    else {
        res.end("404 Page Not Found");
    }

}).listen(3000, () => {
    console.log("Server running at http://localhost:3000");
}); 