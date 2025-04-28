import { FormEventHandler, useState } from "react";
import { fetch_change_comment } from "../../api/storage";
import { ModalChangeCommentProps } from "../../interfaces";

interface FormInterface {
    old_comment: string;
    new_comment: string;
}

export const ModalChangeComment: React.FC<ModalChangeCommentProps> = ({ isModalChangeComment, fileId, fileComment, onClose }) => {

    const [formDataChangeComment, setFormDataChangeComment] = useState({old_comment: '', new_comment: '' });
    formDataChangeComment.old_comment = fileComment;

    const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        const { name, value } = e.target;
    
        setFormDataChangeComment((prevData: FormInterface) => ({
            ...prevData,
            [name]: value
          }));
      };


const  handleSubmitChangeComment: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
  
    const comment = formDataChangeComment.new_comment;
    // const id = formDataChangeComment.id;

    try {
        await fetch_change_comment({comment: comment, id: String(fileId)})

        // закрываем модалку и очищаем форму
        onClose()

        setFormDataChangeComment({
            old_comment: '',
            new_comment: '',
        })
    } catch (error) {
        // обработка ошибок, если необходимо
        console.error('Произошла ошибка:', error);
    }
};
 
return (
    <>
    {/* модальное окно изменения комментария */}
{isModalChangeComment &&
<>
<form onSubmit={handleSubmitChangeComment}>
<div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
    <div className="modal-content">
        <div className="modal-header_change_comment">
            <div className="change-comment_close mt-2">
            <h2 className="modal-title fs-4 ms-3" id="exampleModalLabel">Изменение комментария</h2>
            <button type="button" className="btn-close me-3" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="form-group">
                        <label htmlFor="password">Текущий комментарий</label>
                        <input type="textarea" className="form-control" 
                        id="old_comment" 
                        name="old_comment"
                        value={formDataChangeComment.old_comment}
                        disabled
                        
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new_comment">Новый комментарий</label>
                        <textarea className="form-control" 
                        id="new_comment" 
                        name="new_comment"
                        value={formDataChangeComment.new_comment}
                        required={false}
                        onChange={handleChangeComment}
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