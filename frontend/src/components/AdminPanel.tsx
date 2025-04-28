import { ChangeEventHandler, MouseEventHandler, useEffect, useState } from "react";
import { fetch_delete_user } from "../api/storage";
import { User, Users } from "../interfaces";
import { apiError, apiLoading } from "../actions/apiCreators";
import { useDispatch } from "react-redux";
import { ModalChangeUser } from "./Modals/ModalChangeUser";
import { fetch_change_status, fetch_users } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ModalConfirmDelete } from "./Modals/ModalConfirmDelete";

export const AdminPanel = () => {

    const userId = localStorage.getItem('userId') || '';
    const [statusRefreshListFiles, setStatusRefreshListFiles] = useState(false);
    const is_admin = localStorage.getItem('is_admin');
    const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [userDelete, setUserDelete] = useState<string|null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //получаем список пользователей
    const [users, setUsers] = useState<Users>([]);
    useEffect(() => {

        const fetchlistUsers = async () => {
            try {
            dispatch(apiLoading(true));
            // запрос на получение списка всех пользователей
            const res = await fetch_users();
       
            if (res.status === 200 && 'users' in res) {
                setUsers(res.users);
            } else {
                setUsers([]);
            }

        } catch (error) {
            console.error('Error fetching users:', error);
            dispatch(apiError(String(error)));
            setUsers([]);
     
        }
        finally {
            dispatch(apiLoading(false));
        }
    };

    fetchlistUsers();

    },[statusRefreshListFiles, dispatch]);
    
    const [isModalChangeUser, setIsModaChangeUser] = useState(false);

    const [dataChangeUser, setDataChangeUser] = 
    useState<User>({email: '', full_name: '', username: '', is_admin: false, id: ''});


    // УДАЛЕНИЕ пользователя
    const handleDeleteUser: MouseEventHandler<HTMLElement>  = async (e) => {
        e.preventDefault();
        const button = e.currentTarget as HTMLButtonElement;
        const userId = button.getAttribute('data-item-id');
        setUserDelete(userId);
        const username = button.getAttribute('data-item-username');
        setUsername(username || '');
        setIsModalConfirmDelete(true);

    }

    const confirmDeleteUser = async () => {

        try {
            setLoading(true);
        const status = await fetch_delete_user({id: String(userDelete)})
        if (status == 200) {
            //обновляем список
            setStatusRefreshListFiles(true);

        } else {
            dispatch(apiError('Произошла ошибка. Просьба повторить позднее.'))
        }
    } catch(error) {
        dispatch(apiError(String(error)))
    } finally {
        setUserDelete(null)
        setLoading(false);
        setIsModalConfirmDelete(false);
    }
    };


    // изменение данных пользователя
    const handleChangeUser: MouseEventHandler<HTMLElement>  = async (e) => {
        e.preventDefault();
        const button = e.currentTarget as HTMLButtonElement;
        const userId = button.getAttribute('data-item-id');
        const username = button.getAttribute('data-item-username');
        const email = button.getAttribute('data-item-email');
        const full_name = button.getAttribute('data-item-full_name');

        setDataChangeUser(
            {
                username: username || '',
                email: email || '',
                full_name: full_name || '',
                id: userId || '',
                is_admin: false,
            }
        )
        // вызов модального окна
        setIsModaChangeUser(true)
    };

    const handleChangeStatusAdmin: ChangeEventHandler<HTMLElement>  = async (e) => {
        e.preventDefault();
        const checkbox = e.currentTarget as HTMLInputElement;
        const userId = checkbox.getAttribute('data-item-id') || '';
        const statusAdmin = String(checkbox.checked);
        dispatch(apiLoading(true));
        try {
            
            const res = await fetch_change_status(userId, statusAdmin);
            if (res.status >= 200 && res.status < 300) {
                // обновляем список
                setStatusRefreshListFiles(prev => !prev);
              
            } else {
                dispatch(apiError('Ошибка изменения статуса администратора. Повторите попытку позднее.'));
            }
        } catch (error) {
            console.error('Error changing admin status:', error);
            dispatch(apiError(String(error)));
        } finally { dispatch(apiLoading(false)); }
    }

    // Сортировка по username в алфавитном порядке
    const sortedUsers = [...users].sort((a, b) => a.username.localeCompare(b.username));


    return (
        <>

    {!loading &&  
    <>   
        {!is_admin  && 
        <>
      <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Error</h4>
                <hr/>
                <p>Доступ запрещен</p>
            </div>
        </> 
        }

        {/* Модальное окно подтверждения удаления */}
        {isModalConfirmDelete &&
                <ModalConfirmDelete
                    isOpen={isModalConfirmDelete}
                    name={String(username)}
                    onConfirm={confirmDeleteUser}
                    onClose={() => {setIsModalConfirmDelete(false);}}
                />
            }

   
        {/* модальное окно изменения данных пользователя */}
        {isModalChangeUser &&
        <ModalChangeUser isModalChangeUser={isModalChangeUser} data={dataChangeUser}
        onClose={ () => {
            setIsModaChangeUser(false);
            setDataChangeUser({
                username: '',
                email: '',
                full_name: '',
                id: '',
                is_admin: false,
            });
            setStatusRefreshListFiles(prev => !prev);
        }} /> 
        }
        
{is_admin &&
<>
        {!loading &&
        <>

            <br/>
            <button type="button" className="btn btn-users  btn-secondary me-2" 
            onClick={() => navigate(`/storage/${userId}`)} >
                Вернуться в мой диск
            </button>
            

            <h4><br/>Список всех пользователей:</h4><br/>
           
        <table className="table rounded" >
             <thead>
                 <tr >
                     <th className="th" scope="col">#</th>
                     <th className="th" scope="col">Имя</th>
                     <th className="th" scope="col">Полное имя</th>
                     <th className="th" scope="col">email</th>
                     <th className="th text-center" scope="col">Количество файлов</th>
                     <th className="th text-center" scope="col">Занято на диске, МБайт</th>
                     <th className="th" scope="col">admin</th>
                     <th className="th text-center" scope="col">Действия</th>
                 </tr>
             </thead>

{sortedUsers && sortedUsers.map((user: User, index: number) => (

<tbody key={user.id}>
  <tr key={user.id}>
    <td scope="row">{Number(index) + 1}</td>
    <td className="admin-background-table">{user.username}</td>
    <td className="admin-background-table">{user.full_name}</td>
    <td className="admin-background-table">{user.email}</td>
    <td className="text-center admin-background-table">{Number(user.storage_count) == 0 && <> - </>}
        {Number(user.storage_count) != 0 && user.storage_count}</td>
    <td className="text-center admin-background-table">{Number(user.storage_usage) == 0 && <> - </>}
        {Number(user.storage_usage) != 0 &&
        (Number(user.storage_usage) / (1024 * 1024)).toFixed(2)}
      </td>
    <td className="admin-background-table">
        <input type="checkbox" className="text-center" data-item-id={user.id} checked={user.is_admin} onChange={handleChangeStatusAdmin}/>{user.is_admin}
    </td>

    <td className="text-center admin-background-table">
    <button className="btn btn-outline-danger btn-sm me-2" data-item-id={user.id} 
                                                            data-item-username={user.username}
                                                            data-item-email={user.email}
                                                            data-item-full_name={user.full_name}
                                                            onClick={handleChangeUser}>Изменить</button>
    <button className="btn btn-outline-danger btn-sm me-2" data-item-id={user.id} 
                                                           data-item-username={user.username} onClick={handleDeleteUser}>Удалить</button>
    <button className="btn btn-outline-success btn-sm me-2 " data-item-id={user.id}  
            onClick={() => navigate(`/storage/users/${user.id}`)}>Посмотреть</button></td>
    
  </tr>

</tbody>

))}

</table>

</>

}
</>
}
</>
}
            {loading &&
                 <div className="preloader">
                </div>
            }
        
        
        </>

        
    );
};