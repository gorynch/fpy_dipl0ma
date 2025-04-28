import { useEffect, useState } from "react";
import { fetch_change_user } from "../../api/api";
import { ModalChangeUserProps } from "../../interfaces";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

export const ModalChangeUser: React.FC<ModalChangeUserProps> = ({ isModalChangeUser, data, onClose }) => {


    const [loading, setLoading] = useState(false);

    // Инициализация состояния формы и начальных данных с пустыми значениями
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
    });
    const [initialData, setInitialData] = useState({
        username: '',
        full_name: '',
        email: '',
    });

    useEffect(() => {
        if (data) {
            setFormData(data);
            setInitialData(data);
        }
    }, [data]);

    if (!data) {
        return null;
      }

    const userId = data.id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
          }));
            
      };

      const validateLogin = (login: string): boolean => {
        const regex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
        return regex.test(login);
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()

        // Сравнение данных формы с первоначальными данными
        if (JSON.stringify(formData) === JSON.stringify(initialData)) {
            onClose();
            return; // если данные не изменились, не отправляем запрос
        }

        if (!validateLogin(formData.username)) {
            alert('Логин должен состоять только из латинских символов и цифр, начинаться с буквы, и быть длиной от 4 до 20 символов.');
            return;
        }

        const { username, full_name, email } = formData;
       
        const dataToSend = {
            username: username,
            full_name: full_name,
            email: email,
        }

        try{

            const res = await fetch_change_user(userId, dataToSend)
            setLoading(true)
            const status = res.status
                if (status >= 200 && status < 300 ) {
                    // обновляем имя пользователя в Nav
                    window.location.reload();
                    setLoading(false);
                }
                else {
                    alert('Ошибка. Имя уже существует')
                    return
                }
        
        onClose();

    } catch(err) {
        console.log(err);
    }
    }

    const renderTooltipLogin = (props: TooltipProps) => (
        <Tooltip id="button-tooltip" {...props}>
        Логин должен состоять только из латинских символов и цифр, начинаться с буквы, и быть длиной от 4 до 20 символов.
        </Tooltip>)

    return (
        <>
        {loading &&
        <div className="preloader">
       </div>
        }
        {isModalChangeUser &&
            <form onSubmit={handleSubmit}>
                <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header_change_comment">
                                <div className="change-comment_close mt-2">
                                    <h2 className="modal-title fs-4 ms-3" id="exampleModalLabel">Изменение данных</h2>
                                    <button type="button" className="btn-close me-3" onClick={onClose} aria-label="Close"></button>
                                </div>

                    <div className="form-group">
                        <label htmlFor="login">Логин</label>
                        <OverlayTrigger 
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipLogin}>
                    <input type="login" className="form-control" 
                        id="username" 
                        name="username"
                        value={formData.username}
                      
                        onChange={handleChange}
                        required/>
                        </OverlayTrigger>
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_name">Полное имя</label>
                        <input type="text" className="form-control" 
                        id="full_name" 
                        name="full_name"
                        value={formData.full_name}
                  
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_name">Email</label>
                        <input type="email" className="form-control" 
                        id="email" 
                        name="email"
                        value={formData.email}
                  
                        onChange={handleChange}
                        required/>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn btn-modal ms-3">Изменить</button>
                    </div>    
                </div>
            </div>
        </div>
    </div>
</form>
          
}
</>
    )
}