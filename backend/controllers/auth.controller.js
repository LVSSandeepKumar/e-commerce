export const signup = async (req,res) => {
    try {
        return res.status(201).json({ message: "You ave hit the signup endpoint" });
    } catch (error) {
        console.log("Error in signup controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    try {
        
    } catch (error) {
        console.log("Error in login controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const logout = async (req,res) => {
    try {
        
    } catch (error) {
        console.log("Error in logout controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}