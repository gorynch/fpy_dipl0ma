import { ChangeEvent, MouseEventHandler, useState } from "react";
import { fetch_upload_file } from "../../api/storage";
import { ModalFileUploadProps } from "../../interfaces";
import { apiError } from "../../actions/apiCreators";
import { useDispatch } from "react-redux";

interface FormComment {
    comment: string;
}


export const ModalFileUpload: React.FC<ModalFileUploadProps> = ({ isOpen, userId, onSub, onClose }) => {
    
    const dispatch = useDispatch();

    const [buttonText, setButtonText] = useState('Выберите файл');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formComment, setFormComment] = useState({ comment: '' });
        
    // загрузка файла в хранилище
    const handleUploadFile =  async (e: React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault()
        const comment = formComment.comment;

        try {
        if (selectedFile) {

            const res = await fetch_upload_file({file: selectedFile, userId: userId, comment: comment})
            console.log(res,'ответ после сохранения файла')
            const status = res?.status
            if (status == 201) {
                console.log(' обновляем список файлов')
                // закрываем модальное окно
                onClose();
                // обновляем список файлов
                onSub();

            }
        }
        else {
            alert('Файл не выбран');
        }
        // обнуляем форму модального окна
        setSelectedFile(null);
        setButtonText('Выберите файл');

    } catch(error) {
        dispatch(apiError(String(error)));
    }

    }

 // Открытие диалога выбора файла
const handleChooseFile: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.click();
    } else {
        console.error('File input element not found');
    }
};

// Выбор файла
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0] || null;
      setSelectedFile(file);
      setButtonText(file.name);

    } else {
      setSelectedFile(null);
      setButtonText('Выберите файл');
    }
};

// изменение ввода текста в поле комментарий
const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setFormComment((prevData: FormComment) => ({
        ...prevData,
        [name]: value
      }));
  };

return (
        <>
        {/* загрузить файл на диск */}
                {isOpen &&      
                    <form onSubmit={handleUploadFile}>
                        <div className="modal fade show" style={{ display: "block" }} 
                        tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h2 className="modal-title fs-5" 
                                        id="exampleModalLabel">Выберите файл для загрузки на диск</h2>
                                        <button type="button" className="btn-close" 
                                        onClick={onClose} aria-label="Close"></button>
                                     </div>

                                    <div className="modal-footer">
                                        <div className="form-group_comment">
                                            <label htmlFor="comment">Комментарий</label>
                                            <textarea className="form-control" 
                                            id="comment" 
                                            name="comment"
                                            value={formComment.comment}
                                            required={false}
                                            onChange={handleChangeComment}/>
                                        </div>

                                        <div className="form-group">

                                            <input type="file"
                                            id="fileInput"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}/>

                                            <button type="button" className="btn btn-secondary" 
                                            onClick={handleChooseFile}>{buttonText}
                                            </button>

                                            <button type="submit" 
                                            className="btn btn-modal ms-3" >Загрузить на диск</button>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                
            } 
        </>
)};