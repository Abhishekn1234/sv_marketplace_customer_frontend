import { useQuery } from "@tanstack/react-query";
import { ProfileRepoImpl } from "../../data/repositories/ProfileRepoImpl";
import { GetProfileUsecase } from "../../domain/usecase/GetProfileUsecase";
import type { Profile } from "../../domain/entities/profile";

export function useProfile(){
    const repo= new ProfileRepoImpl();
    const usecase=new GetProfileUsecase(repo);
    
    return useQuery<Profile,Error>({
     queryKey:["profile"],
     queryFn:()=>usecase.execute()
    })
}