// types.ts
export interface ApiState {
  error: string | null;
  username: string | null;
  message: string | null;
  is_authenticated: string | null;
  csrf: string;
  loading: boolean;
}

export interface RootState {
  api: ApiState;
}

export interface initialState  { 
  username: null, 
  error: null, 
  message: null, 
  is_authenticated: false, 
  csrf: null, loading: false }

interface RegisterSuccessResponse {
    status: number;
    csrfToken: string;
    userId: string;
    username: string;
}

interface RegisterErrorResponse {
    message: unknown;
    status: number;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

interface GetSessionSuccessResponse {
  username: string;
  message: unknown;
  isAuthenticated: boolean;
  userId: string;
  status: number;
  is_admin: boolean;
}

interface GetSessionErrorResponse {
  message: unknown;
  username: undefined;
  userId: undefined;
  isAuthenticated: boolean;
  status: number;
  is_admin: boolean;
}

export type GetSessionResponse = GetSessionSuccessResponse | GetSessionErrorResponse;

export interface ApiState {
    error: string | null;
    message: string | null;
    csrfToken: string | null;
    isAuthenticated: boolean;
  }
  
  export interface RootState {
    api: ApiState;
    // другие состояния
  }

export interface ModalChangeCommentProps {
    isModalChangeComment: boolean;
    fileId?: string;
    fileComment: string;
    onClose: () => void;
  }

  export interface ModalChangeFileNameProps {
    isModalChangeFileName: boolean;
    fileId?: string;
    fileName: string;
    onClose: () => void;
  }

  interface UserData {
    username: string;
    email: string;
    full_name: string;
    id: string;
    is_admin: boolean;
  }
  
  export interface ModalChangeUserProps {
    isModalChangeUser: boolean;
    data?: UserData;
    onClose: () => void;
  }

  // Интерфейс для данных о файле
  export interface File {
    id: string;
    file_name: string;
    file_size: string;
    upload_date: string;
    last_download_date: string | null;
    comment: string | null;
    file_path: string;
    special_link: string;
    user: string;
}

// Интерфейс для данных о пользователе
export interface User {
    id: string,
    username: string,
    full_name: string,
    email: string,
    password?: string,
    is_admin: boolean,
    storage_usage?: number,
    storage_count?: number, 
    user_storage_path?: string,
    files?: Files[]

}
export type Users = User[];
export type Files = File[];

// Интерфейс для успешного ответа без данных о пользователях
interface ListFilesSuccessResponseBase {
  files: Files;
  status: number;
}

// Интерфейс для успешного ответа с данными о пользователях (для админов)
interface ListFilesSuccessResponseAdmin extends ListFilesSuccessResponseBase {
  users: Users;
}

// список файлов и юзеров 
// Тип для успешного ответа (админ или не админ)
type ListFilesSuccessResponse = ListFilesSuccessResponseBase | ListFilesSuccessResponseAdmin;

// Интерфейс для ответа с ошибкой
interface ListFilesErrorResponse {
  error: string;
  status: number;
}

// Общий тип для ответа
export type ListFilesResponse = ListFilesSuccessResponse | ListFilesErrorResponse;


// типизация для fetch_storage_id
interface UserFilesSuccessResponse {
  files: Files;
  status: number;
  username: string;
}

interface UserFilesErrorResponse {
  error: string;
  status: number;
}
export type UserFilesResponse = UserFilesSuccessResponse | UserFilesErrorResponse;

// типизация запроса fetch delete file
interface FileDeleteSuccessResponse {
  message: string | '';
  status: number;
}

interface FileDeleteErroreResponse {
  error: string | '';
  status: number;
}

export type FileDeleteResponse = FileDeleteSuccessResponse | FileDeleteErroreResponse;

// типизация для списка пользователей для запроса fetch_users
interface UsersListSuccessResponse {
  users: {
  username: string;
  storage_usage: number;
  storage_count: number;
  full_name: string;
  is_admin: boolean;
  id: string;
  email: string;
  },
  status: number,
}

interface UsersListErrorResponse {
  message: unknown;
  status: number;
}

export type UsersListResponse = UsersListSuccessResponse | UsersListErrorResponse;


export interface AdminPanelProps {
    listUsers: Users;
}

export interface StoragePanelProps {
    listFilesUser: Files;
    username: string;
    userId?: string;
}

export interface ModalFileUploadProps {
    isOpen: boolean;
    userId?: string;
    onClose: () => void;
    onSub: () => void;
  }

  export interface ModalShareLinkProps {
    isModalShareLink: boolean;
    fileId: string;
    onClose: () => void;
  }

