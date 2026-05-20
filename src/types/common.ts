// src/types/common.ts

export type CommonResponse<T> = {
    status:boolean;
    statusCode: number;
    message: string;
    data: T
}

//  무한 스크롤 명세에 맞춰 구조 수정
export type CursorBasedResponse<T> = {
    status:boolean;
    statusCode: number;
    message: string;
    data: T & { 
        nextCursor: number | null; 
        hasNext: boolean;
    }
}

export type PaginationDto = {
    cursor?: number;
    limit? : number;
    search? : string;
    order?: "asc" | "desc";
}