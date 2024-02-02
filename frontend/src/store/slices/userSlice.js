import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PATH_TO_SERVER } from "../../data/constants";


/* получение картинок */
export const getImages = createAsyncThunk(
    "user/getImages",
    async (payload, thunkAPI) => {
      let res;
      try {
        const { userId, userToken, isFavorite } = payload; 
        //отправка запроса на получение избранных
        if (isFavorite) {
          console.log('payload from main page', payload);
         res = await axios.get(`${PATH_TO_SERVER}/user/${userId}/image?isFavorite=${isFavorite}`, {
          headers: {
            Authorization: 'Bearer ' + userToken,
          } });
        console.log("GET DATA favorite", res.data);

        thunkAPI.dispatch(addToFavoriteArray(res.data))
        } else 
        //отправка простого запроса на получение всех картинок
        {
          console.log('payload from main page', payload);
         res = await axios.get(`${PATH_TO_SERVER}/user/${userId}/image`, {
          headers: {
            Authorization: 'Bearer ' + userToken,
          } });
        console.log("GET DATA", res.data);
        }
        
        return res.data;
      } catch (error) {
        console.error(error);
      }
    }
  );
    /* добавление картинки */
export const addUserImage = createAsyncThunk(
  "user/addImage",
  async (payload, thunkAPI) => {
      try {

        const { userId, userToken, image, imageName, imageTags } = payload;

          const formData = new FormData();
          formData.append('image', image.file);
          formData.append('imageName', imageName);
          imageTags.forEach((value) => {
            if (value.length !== 0) {
              formData.append('imageTags', value);
            } 
          });
        const res = await axios.post(`${PATH_TO_SERVER}/user/${userId}/image`,  formData , {
          headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'multipart/form-data'
          }
        }
        ); 
      
      console.log("data about image", res);
      //обновление страницы сразу после добавления
      thunkAPI.dispatch(getImages({userId}, {userToken}));
      return res;

      } catch (err) {
        console.error(err);
      }
  }
)
    /* удаление картинки */
  export const deleteUserImage = createAsyncThunk(
    "user/deleteImage",
    async (payload, thunkAPI) => {
      try {
        const { userId, imageId, userToken } = payload;
        console.log(userId, imageId, userToken);
        const res = await axios.delete(`${PATH_TO_SERVER}/user/${userId}/image/${imageId}`);
         console.log("SUCCESS deleted image", res);
        thunkAPI.dispatch(getImages({userId}, {userToken}));
        return res;
      } catch (err) {
          console.log(err);
          const serializedError = err.toJSON();
          return thunkAPI.rejectWithValue(serializedError);
      }
    }
  )

  /* изменение данных о картинке - добавление в избранное и смена самих данных*/
  export const changeUserImage = createAsyncThunk(
    "user/changeImage",
    async (payload, thunkAPI) => {

      try {
//change  userId to id, userToken to token
        const { userId, imageId, userToken, imageName, imageTags, image, isFavorite} = payload;
        console.log("change img", payload);
        let res;

        // let imageTags = tags2.split(",");
         console.log("imageTags", imageTags, imageTags[0] === null)
          if (imageTags[0] === null) {
            console.log("HELLO", imageName, imageTags, isFavorite);
            res = await axios.put(`${PATH_TO_SERVER}/user/${userId}/image/${imageId}`, {imageName: imageName, isFavorite: isFavorite}, {
              headers: {
                Authorization: 'Bearer ' + userToken,
                'Content-Type': 'application/json'
              }
            }
            );
          } else {
        
        res = await axios.put(`${PATH_TO_SERVER}/user/${userId}/image/${imageId}`, {imageName: imageName, imageTags: imageTags, isFavorite: isFavorite}, {
          headers: {
            Authorization: 'Bearer ' + userToken,
            'Content-Type': 'application/json'
          }
        }
        );
      }

        // if (isFavotite === true) {
          // console.log(isFavotite, payload)
          //thunkAPI.dispatch(setStatusMessage('update'));
           thunkAPI.dispatch(getImages({userId}, {userToken}));
          //thunkAPI.dispatch(addToFavoriteArray(payload));
        //}

        //  if (res.config.data.isFavorite === true) {
        //   console.log(res.config.data.isFavorite, payload)
        //   thunkAPI.dispatch(addToFavoriteArray(payload));
        // }
      
      console.log("changed data about image", res);
      // const succeededCode = res.status;
      // thunkAPI.dispatch(setErrorRegis(succeededCode));
      return res;
    } catch (err) {
      console.error(err);
      const serializedError = err.toJSON();
      // const error = err.response.status;
      // thunkAPI.dispatch(setErrorRegis(error));
      return thunkAPI.rejectWithValue(serializedError);
  } 
  }
  )

  /* создание (регистрация) */
export const createUser = createAsyncThunk(
    "user/createUser",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post(`${PATH_TO_SERVER}/auth/regis`, payload);
            /*записываю успешный ответ от сервера */
            const singUpMessage = res.data.message;
            console.log("singUpMessage", singUpMessage)
            thunkAPI.dispatch(setMessage(singUpMessage));
            console.log(res);
            return res; 
        } catch (err) {
            const errCode = err.response.data.code;
            const existEmail = err.response.data.userEmail;            ;
            console.log("EXIST EMAIL ERROR", existEmail, errCode);
            thunkAPI.dispatch(setExistEmail(existEmail));
            thunkAPI.dispatch(setError(errCode));
            thunkAPI.dispatch(setStatus("failed"));
            console.error(err);
            return err;
        }
    },
);

/* вход в аккаунт */
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${PATH_TO_SERVER}/auth/login`, payload);
      /* получаю токен юзера и сохраняю его глобально */
      const userToken = res.data.data.token;
      console.log("userToken IN USERSLICE", userToken);
      thunkAPI.dispatch(setUserToken(userToken));

      /* получаю ID юзера и сохраняю его глобально */
      const userIdLogin = res.data.data.userId;
      console.log("userIdLogin IN USERSLICE", userIdLogin);
      thunkAPI.dispatch(setUserID(userIdLogin));

      /* записываю успешный ответ от сервера */
      const loginMessage = res.data.message;
      console.log("loginMessage", loginMessage)
      thunkAPI.dispatch(setMessage(loginMessage));
      console.log("res data from login userslice", res.data)
      return res.data;
      
    } catch (error) {
      const errCode = error.response.data.code;
      thunkAPI.dispatch(setError(errCode));
      console.error(error, errCode)
      return error;
    }
  }

)

/* получение инфы о юзере */
export const getInfoAboutUser = createAsyncThunk(
  "user/getInfoAboutUser",
  async (payload, thunkAPI) => {
    try {
      const { userId, userToken } = payload; 
      console.log('payload from acc page', payload);
      const res = await axios.get(`${PATH_TO_SERVER}/user/${userId}`, 
      {
           headers: {
             Authorization: 'Bearer ' + userToken,
           }} );
           console.log("res data from userslice", res.data)
           /* записываю все данные о юзере, в том числе и эмейл,
           чтобы получить его на странице PersonalAccountPage */
           const userData = res.data;
           thunkAPI.dispatch(setAllUserData(userData))
           
           return res.data;
    } catch (err) {
      console.error(err)
      return err;
  }
}
)

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
          const res = await axios.put(`${PATH_TO_SERVER}/user/${payload.id}`);
          return res.data;
      } catch (error) {
          console.log(error);
          return thunkAPI.rejectWithValue(error);
      }
  }
);

const userSlise = createSlice({
    name: 'user',
    initialState: {
        favorite: [],
        status: 'idle',
        error: null,
        message: null,
        images: [],
        UserId: null,
        userToken: null,
        allUserData: [],
        notificationName: "", 
        existEmail: ""
    },
    reducers: {
          addToFavoriteArray: (state, action) => {
            console.log("aaaaaaaaaaaaaa", action.payload);
            state.favorite = action.payload;
          },
          addImageToPage: (state, action) => {
            //state.images = action.payload;
            //state.images.push(action.payload);
            
            // const addImage = action.payload;
            // state.images = {
            //   ...state,
            //   addImage
            // }
            //const imageState = state.images;
            //state.images = Object.values(img);
            // state.images([img]);
            console.log("IMAGE IN ADDIMAGETOPAGE FUNC",  state.images
            //'STATE ', imageState
            );
            
            // state.images.push({img});
          },
          deleteImagefromPage: (state, action) => {
            const image = action.payload;
            const deleteImage = state.images.findIndex((delImage) => delImage === image.id);
            if (deleteImage !== -1) {
              state.images.splice(image.id);
            }
          },
            // setCurrentUser: (state, action) => {
            //     //const UserEmail = action.payload;
            //     const userData = action.payload;
            //     console.log("USER DATA IN ACTION", userData);
            //     console.log("NOW CURRENT USER EMPTY", userData === null)
            //     //console.log("current user email", UserEmail);
                

            //     if (userData === null) {
                 
            //       state.currentUser = [];
            //     } else {
            //       state.currentUser.push(userData);
            //     }
            // },
            setAllUserData: (state, action) => {
              state.allUserData = action.payload;
            },
            setUserID: (state, action) => {
            state.UserId = action.payload;
          },
          setError: (state, action) => {
            const currError = action.payload;

            if (currError !== 200 || currError !== null) {
              state.error = currError;
            }
            //state.error = action.payload;
            //setStatus("failed");
            console.log("err in state", currError);
          },
          setUserToken: (state, action) => {
            state.userToken = action.payload;
          },
          setStatus: (state, action) => {
            state.status = action.payload;
          },
          setMessage: (state, action) => {
            console.log("message in state", action.payload);
            state.message = action.payload;
          },
          setExistEmail: (state, action) => {
            console.log("this exist email in state", action.payload);
            state.existEmail = action.payload;
          },
          showNotification: (state, action) => {
            let newStirng = action.payload;
            console.log("newStirng", newStirng);
            if (newStirng !== "") {
              state.notificationName = newStirng;
            } else {
              state.notificationName = ""
            };
           
          }
    },
    extraReducers: (builder) => {
      //получение изображений - getImages
      builder 
      .addCase(getImages.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.images = action.payload; 
      })
      .addCase(getImages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      });
      //регистрация - createUser
       builder
       .addCase(createUser.pending, (state, action) => {
        state.status = 'loading'
      })
       .addCase(createUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      });
      //вход в акк - loginUser
      //не ставить статусы и забыть про loginUser.pending, я это не поставила, потому что оно
      //мешает загрузке картинок на главной после входа
        builder
        .addCase(loginUser.fulfilled, (state, { payload }) => {
      })
      builder
        .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
});
//обновление пароля - updatePasswordUser
        // builder
        // .addCase(updatePasswordUser.fulfilled, addCurrentUser);
//добавление картинки - addUserImage
      builder
      .addCase(addUserImage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(addUserImage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        let image = action.payload;
        console.log("IMAGE IN addUserImage.fulfilled",image)
      })
      .addCase(addUserImage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      });
// изменение картинки - changeUserImage
      builder
      .addCase(changeUserImage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(changeUserImage.fulfilled, (state, action) => {
         state.status = 'succeeded';
        //let updImage = action.payload;
        //console.log("IMAGE IN updateImageInfo.fulfilled", updImage);
        // state.images.push({updImage})
      } )
      .addCase(changeUserImage.rejected, (state, action) => {
        state.status = 'failed'
      })
// удаление картинки - deleteUserImage
      builder
      .addCase(deleteUserImage.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteUserImage.fulfilled, (state, action) => {
       // state.status = 'succeeded'
      })
      .addCase(deleteUserImage.rejected, (state, action) => {
        state.status = 'failed'
      })

}})

export const selectUserID = (state) => state.user.userID;
export const notificationNmae = (state) => state.user.notificationName;


export const { addToFavoriteArray, addImageToPage, deleteImagefromPage, setUserID, setError, setUserToken, setAllUserData, showNotification, setStatus, setMessage, setExistEmail } = userSlise.actions;

export default userSlise.reducer;
