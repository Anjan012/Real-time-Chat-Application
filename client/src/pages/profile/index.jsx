import { useAppStore } from "@/store/index.js";

export const Profile = () => {
  const {userInfo} = useAppStore();
  return (
    <div>
      <h1>Profile Page</h1>
      <p>This is the Profile page!</p>
      <div>
        Email: {userInfo.email}
      </div>

    </div>
  )
}