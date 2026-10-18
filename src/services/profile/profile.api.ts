import { AvailabilityStatus, EmploymentTypePreference, WorkTypePreference } from "@/utils";
import { createApiInstance } from "@/utils/api";


export interface PortfolioItem {
  itemId: string;
  projectName: string;
  role: string;
  description: string;
  link: string;
  duration: string;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  headline: string;
  bio: string;
  yearsOfExperience: number;
  skills: string[];
  availabilityStatus: AvailabilityStatus;
  employmentTypePreference: EmploymentTypePreference;
  workTypePreference: WorkTypePreference;
  rateOrSalaryExpectation: string;
  portfolioItems: PortfolioItem[];
  socialLinks: {
    gitHub: string;
    linkedIn: string;
    portfolio: string;
    twitter: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertProfileParam {
  headline: string;
  bio: string;
  yearsOfExperience: number;
  skills: string[];
  availabilityStatus: AvailabilityStatus;
  employmentTypePreference: EmploymentTypePreference;
  workTypePreference: WorkTypePreference;
  rateOrSalaryExpectation: string;
  socialLinks: {
    gitHub: string;
    linkedIn: string;
    portfolio: string;
    twitter: string;
  };
  isPublic: boolean;
  experience: {
    projectName: string;
    role: string;
    description: string;
    link: string;
    startDate: string;
    endDate: string | null;
  }[];
}

export interface CreatePortfolioItemParam {
  projectName: string;
  role: string;
  description: string;
  link: string;
  startDate: string;
  endDate: string | null;
}

export interface UpdatePortfolioItemParam {
  projectName: string;
  role: string;
  description: string;
  link: string;
  duration: string;
}


export const profileInstance = createApiInstance("PROFILE");

export async function getMyProfile(): Promise<Profile> {
  const res = await profileInstance.get("");
  return res.data.data;
}

export async function upsertProfile(payload: UpsertProfileParam): Promise<Profile> {
  const res = await profileInstance.put("", payload);
  return res.data.data;
}

export async function deleteMyProfile(): Promise<void> {
  await profileInstance.delete("");
}

export interface TalentFilters {
  availabilityStatus?: AvailabilityStatus | null;
  employmentType?: EmploymentTypePreference | null;
  workType?: WorkTypePreference | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function searchProfiles(filters: TalentFilters): Promise<any> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v)
  );
  const res = await profileInstance.get("/jobs", { params });
  return res.data.data;
}

export async function getProfileByUserId(targetUserId: string): Promise<Profile> {
  const res = await profileInstance.get(`/${targetUserId}`);
  return res.data.data;
}


export async function addPortfolioItem(payload: CreatePortfolioItemParam): Promise<void> {
  await profileInstance.post("/portfolio", payload);
}

export async function updatePortfolioItem(
  itemId: string,
  payload: UpdatePortfolioItemParam
): Promise<void> {
  await profileInstance.patch(`/portfolio/${itemId}`, payload);
}

export async function deletePortfolioItem(itemId: string): Promise<void> {
  await profileInstance.delete(`/portfolio/${itemId}`);
}