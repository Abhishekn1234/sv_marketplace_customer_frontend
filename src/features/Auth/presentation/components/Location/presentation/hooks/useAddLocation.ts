import { useMutation } from "@tanstack/react-query";
import { LocationRepoImpl } from "../../data/repositories/LocationRepoImpl";
import { AddLocationUsecase } from "../../domain/usecases/AddLocationUsecase";
import type { Location } from "../../domain/entities/location";

export function useAddLocation(){
    const repo= new LocationRepoImpl();
    const usecase=new AddLocationUsecase(repo);

    return useMutation({
        mutationKey:["addLocation"],
     mutationFn:(data:Location)=>usecase.execute(data)
     
    })
}