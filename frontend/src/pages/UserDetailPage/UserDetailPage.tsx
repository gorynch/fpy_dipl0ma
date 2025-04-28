import { useNavigate, useParams } from "react-router-dom";
import { StoragePanel } from "../../components/StoragePanel";
import { fetch_storage_id } from "../../api/storage";
import { useCallback, useEffect, useState } from "react";
import { Files, RootState } from "../../interfaces";
import { apiError } from "../../actions/apiCreators";
import { useDispatch, useSelector } from "react-redux";
import { Error } from "../../components/Erorr"

export const UserDetailPage = () => {

    const { error } = useSelector((state: RootState) => state.api);

    const { userId } = useParams();
    const userIdSession = localStorage.getItem('userId');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const is_admin = localStorage.getItem('is_admin');
    const [loading, setLoading] = useState<boolean>(false);
    const [ listFiles, setListFiles ] = useState<Files>([]);
    const [ username, setUsername ] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

        // получаем файлы выбранного пользователя
            const loadFiles = useCallback(async () => {
       
                setLoading(true); // Установка состояния загрузки
                try {
                    const res = await fetch_storage_id(userId || '');
              
                    if (res.status == 200 && 'files' in res) {
                        setListFiles(res.files);
                        setUsername(res.username);
                    } else {
              
                            dispatch(apiError('Ошибка запроса'))
                        
                    }                   
                } catch (error) {
                    console.error('Error fetching files:', error);
                } finally {
                    setLoading(false); // Завершение загрузки
                }
            }, [userId, dispatch]);
            
           
            useEffect(() => {
                loadFiles();
            }, [loadFiles]);
    
    return (
  <>
  {loading && 
  <>
  <div className="preloader">
 </div>
  </>
  }
  {error && <Error/>}
  {!loading && !error &&
  <>
        {is_admin && !loading &&
        <>
        <br/>
        <h5 className="ms-3"><br/>Посмотреть список пользователей: </h5>
        <br/>
        <button type="button" className="btn btn-users  btn-secondary me-2 ms-3" onClick={() => navigate('/storage/users')} >
        Список
        </button>
        <div className="white-line"></div>
        </>
        }
    {isAuthenticated =='true' &&
    <>
        <br/><StoragePanel listFilesUser={listFiles} username={username}/>
    </>
    }
    
    {!is_admin && userId != userIdSession && isAuthenticated =='false' && 
        <>
      <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Error</h4>
                <hr/>
                <p>Доступ запрещен</p>
                <a href="/api">Войти</a>
            </div>
        </> 
    }
    </>
    }
  
    </>

    );
  };
