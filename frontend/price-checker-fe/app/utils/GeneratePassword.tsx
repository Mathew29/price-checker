import axios from 'axios';

const generatePassword = async () => {
    try {
        const response = await axios.get("/api/generate")
        return response.data.password
    } catch (error) {
        console.error("Failed to generate password:", error);
        throw new Error("Unable to generate password. Please try again.");
    }

}

export default generatePassword