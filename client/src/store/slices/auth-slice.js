// setting the user info
export const createAuthSlice = (set) => ({ // you can get set and get function from here 
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo })
});

