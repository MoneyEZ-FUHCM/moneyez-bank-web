export interface BaseResponse<T> {
  status: number;
  errorCode: string;
  message: string;
  data: T;
}

export interface MetaData {
  totalCount: number;
  totalPages: number;
}

export interface CommonResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
}

export const transformCommonResponse = <T>(
  response: any,
): CommonResponse<T> => ({
  items: response.data?.data || [],
  totalCount: response.data?.metaData?.totalCount || 0,
  totalPages: response.data?.metaData?.totalPages || 0,
});

export const transformBaseResponse = <T>(response: any): BaseResponse<T> => ({
  status: response.status,
  errorCode: response.errorCode,
  message: response.message,
  data: response.data,
});


export interface BaseEntity {
  id: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string | null;
  isDeleted: boolean;
}
