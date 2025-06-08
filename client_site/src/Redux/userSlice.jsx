import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({ 
     name:"user",
     initialState:{
          user:null,
          relodUser:true,
     },
     reducers:{
          setUser:(state,action)=>{
               state.user = action.payload;
          },
         
     }
});

export const {setUser,relodUserData} = userSlice.actions;