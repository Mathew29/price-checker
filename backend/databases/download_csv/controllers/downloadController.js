const zmq = require('zeromq')

const downloadCSV = async (req, res) => {
    const data = req.body

    try {
        const socket = new zmq.Request()
        socket.connect("tcp://localhost:5569")

        console.log("Sending data to CSV Microservice...");

        await socket.send(JSON.stringify(data))

        const [csvData] = await socket.receive()

        console.log("Received CSV from microservice");

        res.setHeader("Content-Disposition", 'attachment; filename="data.csv"')
        res.setHeader("Content-Type", "text/csv")
        res.send(csvData.toString())

    } catch (error) {
        console.error("Error during communication with Python server:", error);
        res.status(500).json({ error: "Failed to process the CSV download" });
    }
}

module.exports = {downloadCSV}