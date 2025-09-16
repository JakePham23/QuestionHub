// src/services/data.service.ts
import axios from "@/utils/axios.customize";
import { CurriculumItem, ExamItem } from "@/types/data.type";
import { AxiosError } from 'axios';

const version = "/api";

const dataService = {
  /**
   * Fetches curriculum data from the backend.
   * @returns A promise that resolves to an array of CurriculumItem.
   * @throws An error if the API call fails or the data is malformed.
   */
  async fetchCurriculumData(): Promise<CurriculumItem[]> {
    try {
      const url = `${version}/data_info`;
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      // ✅ Corrected: Access metadata from the `data` property
      if (response.data && Array.isArray(response.data.metadata)) {
        return response.data.metadata;
      } else {
        console.error("Dữ liệu trả về không có thuộc tính 'metadata' hoặc không phải là mảng:", response.data);
        return [];
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu chương trình học:", err);
      throw new Error("Lỗi khi tải dữ liệu chương trình học.");
    }
  },

  /**
   * Fetches a list of exams based on optional grade and subject filters.
   * @param gradeId The ID of the grade to filter by.
   * @param subjectId The ID of the subject to filter by.
   * @returns A promise that resolves to an array of ExamItem.
   * @throws An error if the API call fails or the data is malformed.
   */
  async fetchExams(gradeId: number | null, subjectId: number | null): Promise<ExamItem[]> {
    if (!gradeId && !subjectId) {
      return [];
    }

    try {
      const url = `${version}/exams`;
      const params = new URLSearchParams();

      if (gradeId) {
        params.append("gradeId", String(gradeId));
      }
      if (subjectId) {
        params.append("subjectId", String(subjectId));
      }

      const response = await axios.get(url, {
        params,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      
      // ✅ Corrected: Access metadata from the `data` property
      if (response.data && Array.isArray(response.data.metadata)) {
        return response.data.metadata;
      } else {
        console.error("Dữ liệu đề thi trả về không có thuộc tính 'metadata' hoặc không phải là mảng:", response.data);
        return [];
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách đề thi:", err);
      if (err instanceof AxiosError && err.response) {
        throw new Error("Đề thi loại này chưa được cập nhật. Vui lòng liên hệ Admin hoặc chờ Admin cập nhật thêm nhé!");
      }
      throw new Error("Đã xảy ra lỗi không mong muốn khi tải đề thi.");
    }
  },
};

export default dataService;