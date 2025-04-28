import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register_user } from "../../api/api";
import { apiError, apiIsAuthenticated } from "../../actions/apiCreators";
import { RootState } from "../../interfaces";
import { Tooltip, OverlayTrigger, TooltipProps } from 'react-bootstrap';

export const Register = () => {

    const { csrf, error } = useSelector(
        (state: RootState) => state.api
      );

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        password2: '',
        login: '',
        full_name: '',
        email: '',

     });

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

    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;
        return regex.test(password);
    };
     
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const password = formData.password;
        const password2 = formData.password2;

        if (password !== password2) {
            alert('Пароли не совпадают');
            return;
        }

        const login = formData.login;
        const full_name = formData.full_name;
        const email = formData.email;

        if (!validateLogin(login)) {
            alert('Логин должен состоять только из латинских символов и цифр, начинаться с буквы, и быть длиной от 4 до 20 символов.');
            return;
        }

        if (!validatePassword(password)) {
            alert('Пароль должен быть не менее 6 символов, содержать хотя бы одну заглавную букву, одну цифру и один специальный символ.');
            return;
        }

        const data = {
            username: login,
            password: password,
            full_name: full_name,
            email: email,
        };

        // Отправляем запрос на сервер
        setLoading(true);
        try {
            const res = await register_user(data, csrf);
            if (res.status == 201) {
                
                localStorage.setItem('isAuthenticated', 'true');
                if ('username' in res) {
                localStorage.setItem('username', res.username);
                localStorage.setItem('userId', res.userId);
                dispatch(apiIsAuthenticated(true));
                navigate(`/storage/users/${res.userId}`);
                }

            } else {
            
                if (res.message){ dispatch(apiError(String(res.message)))} 
                else {
                dispatch(apiError("Ошибка регистрации. Повторите попытку позднее"));}
            }
        } catch (err) {
            console.log(err);
            dispatch(apiError("Ошибка регистрации. Повторите попытку позднее"));
        } finally {
            setLoading(false);
        }
    }
    const renderTooltip = (props: TooltipProps) => (
        <Tooltip id="button-tooltip" {...props}>
        Пароль должен быть не менее 6 символов. Минимум с одной заглавной буквой,
        одним специальным символом, одной цифрой.
    </Tooltip>)

    const renderTooltipLogin = (props: TooltipProps) => (
    <Tooltip id="button-tooltip" {...props}>
    Логин должен состоять только из латинских символов и цифр, начинаться с буквы, и быть длиной от 4 до 20 символов.
    </Tooltip>)

    const renderTooltipPassword = (props: TooltipProps) => (
    <Tooltip id="button-tooltip" {...props}>
    Пароли должны совпадать
    </Tooltip>)

return (
<>

    {!loading && error &&
        <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Error</h4>
            <hr/>
            <p>{error}</p>
            <p className="mb-0">
                <a href="/register.html">Вернуться</a>
            </p>
        </div>

        }

        {loading && 
        <div className="preloader">
       </div>

        }

        {!loading && !error &&

            <div className="container-form">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="login">Логин</label>
                        <OverlayTrigger 
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipLogin}>

                    <input type="login" className="form-control" 
                        id="login" 
                        name="login"
                        value={formData.login}
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
                        maxLength={50}
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

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>

                        <OverlayTrigger 
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}>

                        <input type="password" className="form-control" 
                        id="password" 
                        name="password"
                        value={formData.password}
                    
                        onChange={handleChange} required/>
                        </OverlayTrigger>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password2">Повторите пароль</label>

                        <OverlayTrigger 
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltipPassword}>
                        <input type="password" className="form-control" 
                        id="password2" 
                        name="password2"
                        value={formData.password2}
                     
                        onChange={handleChange}
                        required/>
                        </OverlayTrigger>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>

                </form>

            </div>
            }
        </>
    )
}
