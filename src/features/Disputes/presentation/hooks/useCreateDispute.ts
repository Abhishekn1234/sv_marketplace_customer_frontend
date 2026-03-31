import { useMutation } from "@tanstack/react-query";
import { AddDisputesRepoImpl } from "../../data/repositories/AddDisputesRepoImpl";
import { CreateDisputeUsecase } from "../../domain/usecase/CreateDisputeUsecase";
import type { DisputeInput } from "../../domain/entities/disputeinput";

export function useCreateDispute(){
    const repo=new AddDisputesRepoImpl();
    const usecase= new CreateDisputeUsecase(repo);

    return useMutation({
     mutationFn:(input:DisputeInput)=>usecase.execute(input),
     mutationKey:['create-dispute']
    })
}