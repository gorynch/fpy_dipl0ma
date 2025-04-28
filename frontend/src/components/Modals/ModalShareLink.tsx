import { useCallback, useEffect, useState } from "react";
import { ModalShareLinkProps } from "../../interfaces";
import { feth_share_link } from "../../api/storage";
const server = import.meta.env.VITE_SERVER;

export const ModalShareLink: React.FC<ModalShareLinkProps> = ({ fileId, onClose }) => {

    const [formShareLink, setFormShareLink] = useState({link: '',});  
    const [isModalShareLink, setIsModalShareLink] = useState(false);
   
      // поделиться ссылкой
      const handleShareLink = useCallback(async() => {

        try {
        const id = fileId;
        const res = await feth_share_link({id: id});
        const result = res?.result;
        const shareLink = await JSON.parse(result || '').link;
     
        // устанавливаем значение текущего комментария
        setFormShareLink({link : `${server}/storage/` + shareLink || ""});
        setIsModalShareLink(true);

        } catch (error) {
        console.error('Error fetching share link:', error);
        }
      
    }, [fileId]);

    useEffect(() => {
        handleShareLink();
    }, [handleShareLink]);

    // скопировать ссылку
    const handleCopyClick = () => {
         // Копирование текста с использованием navigator.clipboard.writeText
    const linkValue = formShareLink.link;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(linkValue)
        .then(() => {
            alert('Text copied to clipboard');
        })
        .catch((err) => {
            console.error('Failed to copy text: ', err);
        });
    } else {
        // Альтернативный метод для копирования текста
        const tempInput = document.createElement('input');
        tempInput.value = linkValue;
        document.body.appendChild(tempInput);

        tempInput.select();
        try {
            document.execCommand('copy');
            alert('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(tempInput);
    }
    }
    
    const onCloseModal = () => {
        formShareLink.link = '';
        onClose();

    }

return (
    <>
    {/* модальное sharing link */}
{isModalShareLink && 
    <>
<form>
<div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
<div className="modal-dialog">
    <div className="modal-content">
        <div className="modal-header_change_comment">
            <div className="change-comment_close mt-2">
            <h2 className="modal-title fs-4 ms-3" id="exampleModalLabel">Ссылка на файл:</h2>
            <button type="button" className="btn-close me-3" onClick={onCloseModal} aria-label="Close"></button>
            </div>
            <div className="form-group">
                        <input type="text" className="form-control" 
                        id="link" 
                        name="link"
                        value={formShareLink.link}
                        disabled/>
                    </div>
                 
        </div>
        <div className="modal-footer">
        <button type="button" className="btn btn-modal" onClick={handleCopyClick}>Скопировать</button>
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