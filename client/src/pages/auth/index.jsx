import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useState } from 'react';
import { Button } from "@/components/ui/button.jsx"
import { toast } from "sonner";
import {apiClient} from "@/lib/api-client.js";
import { SIGNUP_ROUTE } from "@/utils/constants";
import { LOGIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/index.js";

export const Auth = () => {

    const navigate = useNavigate();
    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const validateLogin = () =>{
        if(!email.length) {
            toast.error("Email is required");
            return false;
        }
        if(!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }

    const ValidateSignup = () => {
        if(!email.length) {
            toast.error("Email is required");
            return false;
        }
        if(!password.length) {
            toast.error("Password is required");
            return false;
        }
        if(password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }

    const handleLogin = async ()=>{
        if(validateLogin()) {
            const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials: true}); 
            console.log(response);

            //  If the user have id
            if(response.data.user.id){
                setUserInfo(response.data.user); // setting the user info in the zustand store
                if(response.data.user.profileSetup) {
                    navigate("/chat");
                } 
                else {
                    navigate("/profile");
                }
            }
        }



    };

    const handleSignup = async () =>{
        if(ValidateSignup()){
            const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, { withCredentials: true}); // to send and receive cookies from the backend
            
            // since whenever a user gets signed up the profile is not set up, we will navigate to the profile setup page
            if(response.status === 201) {
                setUserInfo(response.data.user); // setting the user info in the zustand store
                navigate("/profile");
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100wh] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">
                            Fill in the details to get started with best Chat App!
                        </p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>

                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    className="rounded-full p-6" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}>
                                </Input>
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-full p-6" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}>
                                </Input>

                                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5" value="signup">
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    className="rounded-full p-6" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}>
                                </Input>
                                <Input 
                                    placeholder="Password" 
                                    type="password" 
                                    className="rounded-full p-6" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}>
                                </Input>
                                <Input 
                                    placeholder="Confirm Password" 
                                    type="password" 
                                    className="rounded-full p-6" 
                                    value={confirmPassword} 
                                    onChange={(e) => setconfirmPassword(e.target.value)}>
                                </Input>
                                <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>

                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="background login" className="h=[700px]" />
                </div>
            </div>
        </div>
    )
}