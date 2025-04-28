import { get_csrf } from "./api";
import { ListFilesResponse, UserFilesResponse } from "../interfaces";

const state = {
    csrf: '',
}

const csrfToken = async () => {
    const csrf = state.csrf;
    if (!csrf) {
        const newCsrfToken = await get_csrf();
        return newCsrfToken;
    }
    return csrf;
};


const server = import.meta.env.VITE_SERVER;

// Запрос списка файлов на диске
   export const fetchFiles = async (csrf: string): Promise<ListFilesResponse> => {

    const apiUrl = `${server}/storage/`;
    try {
        const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',  
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf,
        }
    });

    const responseData = await response.text();
    const result = await JSON.parse(responseData)
    return result;

    } catch(error) {
        return ({error: 'Произошла ошибка. Повторите попытку соединения с сервером позднее.', status: 500});
    }   
    };

 //////// Запрос списка файлов на диске по id пользователя
export const fetch_storage_id = async (id: string): Promise<UserFilesResponse> => {

    //const apiUrl = `${server}/storage/${Number(id)}/`; change 25/06
    const apiUrl = `${server}/storage/${id}/`;
    const csrf = await csrfToken() || '';

    try {
        const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrf,
        },
    });
  
    const responseData = await response.text();
    const result = await JSON.parse(responseData);

    return result;
}
    catch (error) {
        console.error('Error downloading file:', error);
        return ({error: 'Произошла ошибка. Повторите попытку соединения с сервером позднее.', status: 500 });   
    }    
}

 
// запрос изменения НАЗВАНИЯ файла //
export const fetch_change_file_name = async (data:{name: string, id: string}) => {
    try {
        const formData = new FormData()
        formData.append('file_name', data.name || '');
        formData.append('id', data.id || '');
        let csrfToken = state.csrf;

        if (!csrfToken) {

            csrfToken = await get_csrf() || '';
        }

        const res = await fetch(`${server}/storage/changename/`, {
            method: "PATCH",
            headers: {
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: formData
        });
        
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
    
        return res.status;

    } catch (error) {
        console.error('Error downloading file:', error);
       
    }
};

  // запрос на изменение КОММЕНТАРИЯ //
export const fetch_change_comment = async (data:{comment: string, id: string}) => {
    try {
        const formData = new FormData()
        formData.append('comment', data.comment || '');
        formData.append('id', data.id || '');

        let csrfToken = state.csrf;
        if (!csrfToken) {
           
            csrfToken = await get_csrf() || ''//getCSRF() || '';
        }

        const res = await fetch(`${server}/storage/comment/`, {
            method: "PATCH",
            headers: {
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: formData
        });
        
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.status
    } catch (error) {
        console.error('Error downloading file:', error);
       
    }
};

// отправка файла на диск //
export const fetch_upload_file = async (data: {file: File, userId?:string, comment: string}) => {

    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('comment', data.comment)
    if (data.userId) {
        formData.append('userId', data.userId)
    }

    let csrfToken = state.csrf;
        if (!csrfToken) {
         
            csrfToken = await get_csrf() || '';
        }

        try{
            const res = await fetch(`${server}/storage/upload/`, {
                 method: "POST",
                headers: {
                "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: formData,
                });

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return {message: res.statusText, status: res.status}

            } catch (error) {
                console.error('Error uploading file:', error);
               
            }
}

// DELETE user
export const fetch_delete_user = async (data: {id: string}) => {
  const userId = data.id

  let csrfToken = state.csrf;
    if (!csrfToken) {

        csrfToken = await get_csrf() || ''
    }
    try {
        const res =await fetch(`${server}/users/delete/${Number(userId)}/`, {
         method: "DELETE",
        headers: {
        "Content-Type": "co",
        "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        });

        return res.status;
        
        } catch (error) {
    console.error('Error deleting file:', error);
    }
}



// DELETE файл
export const fetch_delete_file = async (fileId: string) => {

    const csrf = await csrfToken() || '';
  
    try {
        const res =await fetch(`${server}/storage/delete/${Number(fileId)}/`, {
         method: "DELETE",
        
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrf,
        },
        credentials: "include",

        });

        if (res.status == 204) {
            return { status: 204}
        }
        else {
            return {
                error: "Ошибка удаления файла",
                status: res.status,
            }
        }
        
        } catch (error) {
            console.error('Error deleting file:', error);
    }
};


// DOWNLOAD файл
export const fetch_download_file = async(id: string, file_name: string) => {

    const fileId = id;
    const csrf = await csrfToken() || '';

    try {
        const res = await fetch(`${server}/storage/download/${Number(fileId)}/`, {
            method: "GET",
        
            headers: {
                "X-CSRFToken": csrf,
            },
            credentials: "include",
        });
        
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
      
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;         
        a.download = file_name || '';
        document.body.appendChild(a);
        a.click();
        a.remove();

        return {
            url : url,
            status: res.status
        }  

    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

// SHARE link
export const feth_share_link = async (data: {id: string}) => {

    const fileId = data.id

    let csrfToken = state.csrf;
    if (!csrfToken) {
        csrfToken = await get_csrf() || ''//getCSRF() || '';
    }

    try {
        const res = await fetch(`${server}/storage/sharelink/${Number(fileId)}/`, {
            method: "GET",
        
            headers: {
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
        });
        
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result =  await res.text()

        return {
            result : result,
            status: res.status
        }

    } catch (error) {
        console.error('Error downloading file:', error);
    }
}
