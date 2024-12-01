const zmq = require("zeromq");

const generateLineGraph = async (req,res) => {
    const data = req.body

    try {
        const socket = new zmq.Request();
        socket.connect("tcp://localhost:5689");
        console.log("Connecting to graph microservice...");
        await socket.send(JSON.stringify(data))

        const [msg] = await socket.receive();

        res.setHeader("Content-Type", "image/png")
        res.send(msg)

    } catch (error) {
        console.error("Error communicating with graph microservice:", error);
        res.status(500).send("Error generating line graph");
    }
}

module.exports = {generateLineGraph}