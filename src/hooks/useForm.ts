import { useEffect, useState } from "react";
import { type ChangeEvent } from "react";

interface UseFormProps<T> {
    defaultValues: T;
    validate: (values: T) => Record<keyof T, string>; 
}

function useForm<T>({ defaultValues: defaultValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(defaultValues);
    const [touched, setTouched] = useState<Record<string, boolean>>(
        {} as Record<string, boolean>
    );
    const [errors, setErrors] = useState<Record<string, string>>(
        {} as Record<string, string>
    );
    
    //사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name: keyof T, text: string) => {
        setValues({
            ...values, // 불변성 유지(기존 값 유지) 
            [name]:text,
        }
        );
    } ;

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        });
    };

    //이메일 인풋, 패스워드 인풋, 속성들을 가져오는것
    const getInputProps = (name: keyof T) => {
        const value: T[keyof T] =values[name];
        const onChange= (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
            handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur}
    }

    //values 가 변경될 때마다 에러 검증 로직이 실행된다
    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors); //오류메세지 업데이트
    }, [validate, values]);
    
    return {values, errors, touched, getInputProps}
}

export default useForm