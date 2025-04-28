import { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetch_delete_file, fetch_download_file, fetch_storage_id } from "../api/storage";
import { ModalFileUpload } from "./Modals/ModalFileUpload";
import { ModalChangeComment } from "./Modals/ModalChangeComment"
import { apiError } from "../actions/apiCreators";
import { ModalChangeFileName } from "./Modals/ModalChangeFileName";
import { File, Files, RootState, StoragePanelProps, User } from "../interfaces";
import { ModalShareLink } from "./Modals/ModalShareLink";
import { useParams } from "react-router-dom";
import { ModalChangeUser } from "./Modals/ModalChangeUser";
import { fetch_user_data } from "../api/api";
import { ModalConfirmDelete } from "./Modals/ModalConfirmDelete";
import { Error } from "./Erorr";


// панель хранилища любого пользователя
export const StoragePanel: React.FC<StoragePanelProps> = ({ listFilesUser, username })  => {


    const { error } = useSelector((state: RootState) => state.api);

    // берем user id из параметров ссылки
    const { userId } = useParams();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch();
    
    //const [uploadStatus, setUploadStatus] = useState(false);
    const [isModalChangeComment, setIsModalChangeComment] = useState(false);
    // для передачи id file в модальное окно
    const [fileId, setFileId] = useState<string | null>(null);
    // для передачи названия файла в модальное окно
    const [fileName, setFileName] = useState<string | null>(null);
    // для передачи комментария в модальное окно
    const [fileComment, setFileComment] = useState<string | null>(null);
    // для изменения данных
    const [data, setData] = useState<User>({email: '', full_name: '', username: '', is_admin: false, id: ''});

    const [isModalFileNameChange, setIsModalFileNameChange] = useState(false);
    const [isModalShareLink, setIsModalShareLink] = useState(false);
    const [isModalChangeUser, setIsModalChangeUser] = useState(false);
    const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
    const [ statusRefreshListFiles, setStatusRefreshListFiles] = useState(false);
    const [ listFiles, setListFiles ] = useState<Files>([])
      
    // перерендеринг компонента при изменении количества файлов пользователя
      useEffect(() => {
        if (listFilesUser) {
            setListFiles(listFilesUser);
        }
    }, [listFilesUser]);

    // открытие модального окна изменения названия файла
const handleChangeFileNameModal: MouseEventHandler<HTMLElement> = async (e) => {
    e.preventDefault();
    const link = e.currentTarget;
    const name = link.getAttribute('data-item-file_name');
    setFileName(name)
    const id = link.getAttribute('data-item-id')
    // устанавливаем id file для передачи в модальное окно
    setFileId(id)
    // открываем модальное окно
    setIsModalFileNameChange(true)
};

    // открытие модального окна загрузки файла   
    const handleModal: MouseEventHandler<HTMLElement> = (e) => {
        //getCSRF();
        e.preventDefault()
        //setUploadStatus(true);
        setIsModalOpen(true);
    }

    useEffect(() => {
        if (statusRefreshListFiles) {

            const loadFiles = async () => {
                        setLoading(true); // Установка состояния загрузки
                        try {
                            const res = await fetch_storage_id(userId || '');
                         
                            if (res.status == 200 && 'files' in res) {
                                setListFiles(res.files);
                            
                            } else {
                                if ('error' in res)
                                dispatch(apiError(res.error))
                            }
                           
                        } catch (error) {
                            dispatch(apiError(String(error)))
                            console.error('Error fetching files:', error);
                          
                        } finally {
                            setLoading(false); // Завершение загрузки
                        }
                    };
                    loadFiles();

            setStatusRefreshListFiles(false);
        }
    }, [statusRefreshListFiles, userId, dispatch]);

    const [, setLoading] = useState(true);
    

   // запрос УДАЛЕНИЕ файла
    const handleDeleteFile: MouseEventHandler<HTMLElement>  = async (e) => {
        e.preventDefault()
        const button = e.currentTarget as HTMLButtonElement;
        const fileId = button.getAttribute('data-item-id');
        const filename = button.getAttribute('data-item-filename');
        setFileName(filename);

        if (!fileId) {
            dispatch(apiError('File ID not found'));
            return;
        }
        setFileId(fileId);
        setIsModalConfirmDelete(true);
    };


    const confirmDeleteFile = async () => {
        console.log('запрос удаления')
      
        if (!fileId) return;

        try {
            setLoading(true);
            const res = await fetch_delete_file(fileId);

            if (res && res.status === 204) {
                setListFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
                setStatusRefreshListFiles(true);
            } else {
                dispatch(apiError('Не удалось выполнить удаление файла'));
            }
            
        } catch(error) {
            dispatch(apiError(String(error)))
        } finally {
            setLoading(false);
            setIsModalConfirmDelete(false);
            setFileId(null);
        }
    };


    // СКАЧИВАНИЕ файла
    const handleDownloadFile: MouseEventHandler<HTMLElement> = async (e) => {
       e.preventDefault();
        const link = e.currentTarget;
        const fileId = link.getAttribute('data-item-id');
        const file_name =link.getAttribute('data-item-filename') || '';
        
        if (!fileId) {
            dispatch(apiError('File ID not found'));
            return;
        }
       try {
        const res = await fetch_download_file(fileId, file_name);

       if (res?.status != 200) {
        dispatch(apiError('Ошибка скачивания файла.'))
       }
        } catch (error) {
            dispatch(apiError(String(error)));
        
        } finally {
            setStatusRefreshListFiles(true);
        }
    };


// открытие модального окна изменить комментарий
    const handleChangeCommentModal: MouseEventHandler<HTMLElement> = async (e) => {
        e.preventDefault();
        const link = e.currentTarget;
        const comment = link.getAttribute('data-item-comment');
        const id = link.getAttribute('data-item-id')
        setFileId(id)
        setFileComment(comment)
        // открываем модальное окно
        setIsModalChangeComment(true)
    }

// открытие модального окна ИЗМЕНЕНИЯ данных пользователя
    const handleChangeUserModal: MouseEventHandler<HTMLElement> = async (e) => {
        e.preventDefault();
        // запрашиваем полные данные пользователя
        try {
        
            const res = await fetch_user_data(userId || '');
            setData(res.user[0]);
       
        } catch (error) {
            dispatch(apiError(String(error)));
        } finally {
            // открываем модальное окно
            setIsModalChangeUser(true);
        }
    }

    const formatDate = (isoString: string) => {
     const date = new Date(isoString);
     return date.toLocaleString();
      };

      // ПРОСМОТР файла
      const handleLinkClick = async(e: React.MouseEvent<HTMLAnchorElement>, file_name: string) => {
        e.preventDefault();
        const link = e.currentTarget;
        const id = link.getAttribute('data-item-id');
        if (!id) {
            return;
        }

        // скачиваем файл локально и получаем локальную ссылку на него
        const res = await fetch_download_file(id, file_name)
        // Открываем файл в новой вкладке
        window.open(res?.url, '_blank')
      };

    // поделиться ссылкой
    const handleShareLink: MouseEventHandler<HTMLElement> = async(e) => {
        const link = e.currentTarget;
        const id = link.getAttribute('data-item-id') || ''
        // устанавливаем id file для передачи в модальное окно
        setFileId(id);
       setIsModalShareLink(true)
     
    };

     // сортировка файлов по дате загрузки
     const sortedFiles = [...listFiles].sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());

    return (
        <>
        { error && <Error/>
         }
        { !error &&
        <>
        {/* модальное окно выбора файла и отправки на сервер */}
        {isModalOpen &&
        <ModalFileUpload isOpen={isModalOpen} userId={userId} 
        onSub={() => {setIsModalOpen(false); setStatusRefreshListFiles(true);}}
        onClose={() => setIsModalOpen(false)} />
        }

        {/* модальное окно изменения комментария к файлу */}
        {isModalChangeComment &&
        <ModalChangeComment isModalChangeComment={isModalChangeComment} fileId={String(fileId)} fileComment={String(fileComment)}
        onClose={() => {setIsModalChangeComment(false); setFileId(null); setFileComment(null), setStatusRefreshListFiles(true);}}/>
        }

         {/* модальное окно изменения названия файла */}
         {isModalFileNameChange &&
        <ModalChangeFileName isModalChangeFileName={isModalFileNameChange} 
        fileId={String(fileId)} fileName={String(fileName)}
        onClose={() => {setIsModalFileNameChange(false); setFileId(null); setFileName(null); setStatusRefreshListFiles(true);}}/>
        }

        {/* модальное окно поделиться ссылкой */}
        {isModalShareLink &&
        <ModalShareLink isModalShareLink={isModalShareLink} 
        fileId={String(fileId)}
        onClose={() => {setIsModalShareLink(false); setFileId(null); setStatusRefreshListFiles(true);}}/>
        }
        {/* модальное окно изменения данных пользователя */}
        {isModalChangeUser &&
        <ModalChangeUser isModalChangeUser={isModalChangeUser}
        data={data}
        onClose={() => {setIsModalChangeUser(false); setFileId(null); setStatusRefreshListFiles(true);}}/>
        }
        {/* Модальное окно подтверждения удаления */}
        {isModalConfirmDelete &&
                <ModalConfirmDelete
                    isOpen={isModalConfirmDelete}
                    name={String(fileName)}
                    onConfirm={confirmDeleteFile}
                    onClose={() => {setIsModalConfirmDelete(false);}}
                />
            }
        <>

<div className="flex-row">
<h5 className="ms-3"><br/>Файлы пользователя {username}:</h5>
</div>
<br/>
<div className="flex-row mb-4">
        <div className="flex-row">  
       <button type="button" className="btn  btn-secondary me-2 ms-3" 
                        data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleChangeUserModal}
                    >Изменить данные пользователя</button>
 
        </div>

        <div className="flex-row">
       <button type="button" className="btn  btn-secondary me-2 ms-3" 
                        data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleModal}
                    >Загрузить файл</button>

        </div>
    
</div>
         <table className="table rounded" >
             <thead>
                 <tr key={1}>
                     <th className="th" scope="col">#</th>
                     <th className="th" scope="col">Название</th>
                     <th className="th" scope="col">Комментарий</th>
                     <th className="th" scope="col">Размер, МБайт</th>
                     <th className="th" scope="col">Дата загрузки</th>
                     <th className="th" scope="col">Дата посл. скачивания</th>
                     <th className="th text-center" scope="col">Действия</th>
                 </tr>
             </thead>

            {sortedFiles.length >0 && sortedFiles.map((item: File, index: number) => (

<tbody key={item.id}>
  <tr key={item.id}>
    <td scope="row">{index + 1}</td>
    <td><a href="#" data-item-id={item.id} onClick={(e) => handleLinkClick(e, item.file_name)}>{item.file_name}</a></td>
    <td>
    <a href='#' data-item-comment={item.comment}  data-item-id={item.id}  onClick={(e) => handleChangeCommentModal(e)}>
    { item.comment && <span>{item.comment} </span> }
    { !item.comment && <button className="btn btn-outline-success btn-sm me-2" data-item-id={item.id} >Добавить комментарий</button> }
    </a>
    </td>  
    <td>{(Number(item.file_size) / (1024 * 1024)).toFixed(2)}</td>
    <td>{formatDate(item.upload_date)}</td>
    <td>
        {item.last_download_date && formatDate(item.last_download_date)}
        {!item.last_download_date && null}</td>

    <td><button className="btn btn-outline-danger btn-sm me-2" data-item-id={item.id} data-item-filename={item.file_name} onClick={handleDeleteFile}>Удалить</button>
    <button className="btn btn-outline-success btn-sm me-2" data-item-filename={item.file_name} data-item-id={item.id} onClick={(e) => handleDownloadFile(e)}>Скачать</button>
    <button className="btn btn-outline-success btn-sm me-2" data-item-id={item.id} data-item-file_name={item.file_name} onClick={(e) => handleChangeFileNameModal(e)}  >Переименовать</button>
    <button className="btn btn-outline-success btn-sm me-2" data-item-id={item.id}  onClick={(e) => handleShareLink(e)}>Поделиться</button></td>
  </tr>
</tbody>
))} 

</table>

</>
</>}
        </>
    )
    
};
