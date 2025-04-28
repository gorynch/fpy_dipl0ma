import { FormEventHandler, useState } from "react";
import { ModalChangeFileNameProps } from "../../interfaces";
import { fetch_change_file_name } from "../../api/storage";
import { apiError } from "../../actions/apiCreators";
import { useDispatch } from "react-redux";

interface FormInterface {
    old_name: string;
    new_name: string;
}

export const ModalChangeFileName: React.FC<ModalChangeFileNameProps> = ({ isModalChangeFileName, fileId, fileName, onClose }) => {

    const dispatch = useDispatch()

    const [formDataChangeFileName, setformDataChangeFileName] = useState({old_name: '', new_name: '' });

    formDataChangeFileName.old_name = fileName;

    // изменение ввода текста в поле комментарий
    const handleChangeFileName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        const { name, value } = e.target;

        setformDataChangeFileName((prevData: FormInterface) => ({
            ...prevData,
            [name]: value
        }));
    };

    // submit отправки формы с новым названием
  const  handleSubmitChangeFileName: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
  
    const old_name = formDataChangeFileName.old_name;
    // берем расширение файла
    const extension = old_name.split('.').pop();
    const name = formDataChangeFileName.new_name + '.' + extension;
    const id = fileId;

    try {
        const status = await fetch_change_file_name({name: name, id: String(id)})

        if (status == 204) {
            // закрываем модалку и очищаем форму
            setformDataChangeFileName({
                old_name: '', new_name: '',})
            onClose();
        } else { 
            dispatch(apiError(String('Ошибка. Повторите позднее.')));
            onClose();
          }
    } catch (error) {
        // обработка ошибок, если необходимо
        console.error('Произошла ошибка:', error);
        dispatch(apiError(String(error)))
    }
};

return (
    <>
    {/* модальное окно изменения названия файла */}
{isModalChangeFileName && 
    <>
<form onSubmit={handleSubmitChangeFileName}>
<div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
    <div className="modal-content">
        <div className="modal-header_change_comment">
            <div className="change-comment_close mt-2">
            <h2 className="modal-title fs-4 ms-3" id="exampleModalLabel">Изменение названия файла</h2>
            <button type="button" className="btn-close me-3" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="form-group">
                        <label htmlFor="old_name">Текущее название</label>
                        <input type="textarea" className="form-control" 
                        id="old_name" 
                        name="old_name"
                        value={formDataChangeFileName.old_name}
                        disabled
                        
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new_name">Новое название</label>
                        <textarea className="form-control" 
                        id="new_name" 
                        name="new_name"
                        value={formDataChangeFileName.new_name}
                        required
                        onChange={handleChangeFileName}
                        />
                    </div>
        </div>
        <div className="modal-footer">
        <button type="submit" className="btn btn-modal" >Изменить</button>
        </div>
    </div>
</div>
</div>
</form>
</>
}
</>
)
}