import type { DisputeStatus } from "./disputestatus";
import type { ApiResponse } from "./getdisputesapiresponse";
import type { UserRole } from "./userroles";

export interface GetAllDisputes{
  _id: string;
  bookingId: string;
  raisedByUserId: string;

  raisedBy: UserRole;

  reason: string;
  description: string;

  status: DisputeStatus;

  resolutionNote?: string;
  resolvedByUserId?: string;
  resolvedAt?: string;

  workerResponse?: string;

  createdAt: string;
  updatedAt: string;
}


export type GetDisputesAllResponse = ApiResponse<GetAllDisputes>;