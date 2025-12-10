import { apiClient } from "./apiClient";
import { endpoints } from "./endpoints";

export const createJobApplication = async (body: any) => {
  // If resume is a File, send multipart/form-data so file is uploaded
  try {
    if (body && body.resume instanceof File) {
      const fd = new FormData();
      if (body.name) fd.append("name", String(body.name));
      if (body.email) fd.append("email", String(body.email));
      if (body.phone) fd.append("phone", String(body.phone));
      if (body.location) fd.append("location", String(body.location));
      if (body.gender) fd.append("gender", String(body.gender));
      if (body.dob) fd.append("dob", String(body.dob));
      if (body.cover_letter) fd.append("cover_letter", String(body.cover_letter));
      fd.append("resume", body.resume as File);

      return apiClient.post(endpoints.jobApplications.create(), fd);
    }

    // Otherwise send JSON payload
    const payload = {
      name: body?.name ?? "",
      email: body?.email ?? "",
      phone: body?.phone ?? "",
      location: body?.location ?? "",
      gender: body?.gender ?? "",
      dob: body?.dob ?? body?.dateOfBirth ?? "",
      resume: body?.resume ?? "",
      cover_letter: body?.cover_letter ?? body?.coverLetter ?? "",
    };

    return apiClient.post(endpoints.jobApplications.create(), payload);
  } catch (e) {
    throw e;
  }
};

export default { createJobApplication };
