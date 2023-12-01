import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setAuthStatus } from './authSlice';
import axios from "axios";

/* получение картинок */
export const getImages = createAsyncThunk(
    "user/getImages",
    async (payload, thunkAPI) => {
      try {
        const res = await axios.get(`http://95.31.50.131/api/user/${payload.id}/image`, {headers:{Authorization: `Bearer ${payload.token}`}});
        return res.data;
      } catch (error) {
        console.log(error);
        const serializedError = error.toJSON();
        return thunkAPI.rejectWithValue(serializedError);
      }
    }
  );
    /* добавление картинки, когда юзер уже в своем акке */
 export const addUserImage = createAsyncThunk(
    "user/addImage",
    async (payload, thunkAPI) => {
        try {
            // const currentUserId = payload.id;
            const res = await axios.post(`http://95.31.50.131/api/user/${payload.id}/image`);
            console.log("res data in addImage", res.data);
            thunkAPI.dispatch(addImageToPage(res.data));
            return res.data;
        } catch (err) {
            console.log(err);
            const serializedError = err.toJSON();
            return thunkAPI.rejectWithValue(serializedError);
        }
    }
  )
    /* удаление картинки */
  export const deleteUserImage = createAsyncThunk(
    "user/deleteImage",
    async (payload, thunkAPI) => {
      try {
        const imageID = payload.id;
        //исправила тут await axios.delete на await axios.get
        const res = await axios.get(`http://95.31.50.131/api/user/${payload.id}/image/${imageID}`);
        console.log("data about deleted image", res);
        thunkAPI.dispatch(deleteImagefromPage(res));
        return res;
      } catch (err) {
          console.log(err);
          const serializedError = err.toJSON();
          return thunkAPI.rejectWithValue(serializedError);
      }
    }
  )

  /* изменение данных о картинке */
  export const changeUserImage = createAsyncThunk(
    "user/changeImage",
    async (payload, thunkAPI) => {

      try {
      const imageID = payload.id;
      //тут только получаем данные о картинке
      // const dataOfImage = await axios.get(`http://95.31.50.131/api/user/${payload.id}/image/${imageID}`);
      // console.log("data about changed image", dataOfImage);
      const changedData = payload;
      const res = await axios.put(`http://95.31.50.131/api/user/${payload.id}/image/${imageID}`, changedData);
      console.log("changed data about image", res)
      //thunkAPI.dispatch(deleteImagefromPage(res));
      return res;
    } catch (err) {
      console.log(err);
      const serializedError = err.toJSON();
      return thunkAPI.rejectWithValue(serializedError);
  } 
  }
  )

  /* получение пользователя по ID */
export const getUser =  createAsyncThunk(
  "user/getUser",
  async (payload, thunkAPI) => {
    try {
      const userData = await axios.get(`http://95.31.50.131/api/user/${payload.id}`);
      return userData;

    } catch (err) {
      console.log(err);
      const serializedError = err.toJSON();
      return thunkAPI.rejectWithValue(serializedError);
    }
  } 
)

  /* создание (регистрация) */
export const createUser = createAsyncThunk(
    "user/createUser",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post('http://95.31.50.131/api/auth/regis', payload);
            /* после отправки запроса я получаю данные: email & id,
            записываю их в переменные и передаю текущему юзеру */
            console.log("HELLLLLLLLLL", res);
             const userEmail = res.data.data.UserEmail;
             console.log(userEmail);
            // /* добавление эмейла в текущего юзера */
             thunkAPI.dispatch(setCurrentUser(userEmail));
             const UserID = res.data.data.UserID;
             console.log("UserID", UserID);
            // /* добавление id текущего юзера */
             thunkAPI.dispatch(setUserID(UserID));
            return res.data; 
            
            
        } catch (error) {
            console.log(error);
            const serializedError = error.toJSON();
            return thunkAPI.rejectWithValue(serializedError);
        }
    },
);

/* вход в аккаунт */
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post('http://95.31.50.131/api/auth/login', payload);
      console.log("hoaihdiasdisajdsia", res);
      const UserToken = res.data.token;
      console.log("userToken", UserToken);
      thunkAPI.dispatch(setUserToken(UserToken));

      const userId = res.data.userId;
      console.log("userToken", userId);
      thunkAPI.dispatch(setUserID(userId));
      return res.data;
      
    } catch (error) {
      console.log(error)
      const serializedError = error.toJSON();
      return thunkAPI.rejectWithValue(serializedError);
    }
  }

)


// //надо куда-то деть authToken
// export const loginUser = createAsyncThunk(
//     "user/loginUser",
//     async (payload, thunkAPI) => {
//         try {
//             const res = await axios.post('http://95.31.50.131/api/auth', payload);
//             const login = await axios('http://95.31.50.131/api/auth', payload);
//             return login.data;
//         } catch (error) {
//             console.log(error);
//             const serializedError = error.toJSON();
//             return thunkAPI.rejectWithValue(serializedError);
//         }
//     }
// );

/* обновление пароля */
// export const updatePasswordUser = createAsyncThunk(
//     "user/updatePasswordUser",
//     async (payload, thunkAPI) => {
//         try {
//             const res = await axios.put(`http://95.31.50.131/api/user/${payload.id}`, payload);
//             return res.data;
//         } catch (error) {
//             console.log(error);
//             return thunkAPI.rejectWithValue(error);
//         }
//     }
// );
export const updatePasswordUser = createAsyncThunk(
  "user/updatePasswordUser",
  async (payload, thunkAPI) => {
      try {
          const res = await axios.put(`http://95.31.50.131/api/user/${payload.id}`);
          return res.data;
      } catch (error) {
          console.log(error);
          return thunkAPI.rejectWithValue(error);
      }
  }
);

const addCurrentUser = (state, { payload }) => {
    state.currentUser = payload; 
};

const userSlise = createSlice({
    name: 'user',
    initialState: {
        currentUser: [],
        favorite: [],
        isLoading: false,
        images: [],
        UserId: null,
        userToken: null,
    },
    reducers: {
        toggleFavorites: (state, action) => {
            const item = action.payload;
            const index = state.favorite.findIndex((favoriteItem) => favoriteItem.id === item.id);
            if (index === -1) {
              state.favorite.push(item);
            } else {
              state.favorite.splice(index, 1);
            }
          },
          addImageToPage: (state, action) => {
            const img = action.payload;
            state.images.push(img);
            console.log("yooooooo images", img)
          },
          deleteImagefromPage: (state, action) => {
            const image = action.payload;
            const deleteImage = state.images.findIndex((delImage) => delImage === image.id);
            if (deleteImage !== -1) {
              state.images.splice(image.id);
            }
          },
          // changeDataOfImage: (state, action) => {
          //   const currentImage = action.payload;

          // },
            setCurrentUser: (state, action) => {
                const UserEmail = action.payload;
                state.currentUser.push(UserEmail);
                console.log("current user email", UserEmail);
            },
            setUserID: (state, action) => {
            state.UserId = action.payload;
            console.log("UserId success", state.UserId);
            // state.currentUser.push(state.UserId);
            // console.log("CurrentUser + UserId", currentUser);
          },
          setUserToken: (state, action) => {
            state.userToken = action.payload;
            console.log("userToken success", state.userToken)
          }
    },
    extraReducers: (builder) => {
       builder
       .addCase(createUser.fulfilled, (state, { payload }) => {
        addCurrentUser(state, { payload });
        setAuthStatus(true);
      });
        builder
        .addCase(loginUser.fulfilled, (state, { payload }) => {
            addCurrentUser(state, { payload });
            setAuthStatus(true); 
    });
        builder
        .addCase(updatePasswordUser.fulfilled, addCurrentUser);
        builder
      .addCase(getImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.images = action.payload; 
        state.isLoading = false;
      })
      .addCase(getImages.rejected, (state) => {
        state.isLoading = false;
      });

      builder
      .addCase(addUserImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUserImage.fulfilled, (state, action) => {
        state.images = action.payload;
        state.isLoading = false;
      })
      .addCase(addUserImage.rejected, (state) => {
        state.isLoading = false;
      })

}})


export const selectUserID = (state) => state.user.userID;

export const { toggleFavorites, addImageToPage, createUserAction, setUserID, setCurrentUser, deleteImagefromPage, setUserToken } = userSlise.actions;

export default userSlise.reducer;
