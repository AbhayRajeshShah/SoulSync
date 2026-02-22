"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/axios";
import { useUser } from "@/providers/UserProvider";

interface ApiResponse {
  message: string;
}

interface FormData {
  title?: string;
  image?: string;
  body?: string;
}

const Page = () => {
  const categories = [
    "Student Life",
    "Study Tips & Productivity",
    "Academic Stress",
    "Exam Preparation",
    "Mental Health & Wellness",
    "Stress Management",
    "Self-Care & Personal Growth",
    "Work-Life-School Balance",
    "Relationships & Social Life",
  ] as const;

  type Category = (typeof categories)[number];

  const [category, setCategory] = useState<Category>(categories[0]);
  const [formData, setFormData] = useState<FormData>({});
  const [access, setAccess] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await api.post("blogs/new", {
        ...formData,
        uid: user._id,
        category,
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="">
      <form onSubmit={onSubmit} className="md:px-32 sm:px-16 py-8">
        <div className="flex gap-3 justify-center flex-wrap mx-auto my-8">
          {categories.map((c) => (
            <div
              key={c}
              className={
                c === category
                  ? "px-4 cursor-pointer py-2 shadow-lg flex rounded-md justify-center items-center bg-primary text-white"
                  : "px-4 cursor-pointer py-2 shadow-lg flex rounded-md justify-center items-center bg-white text-black "
              }
              onClick={() => setCategory(c)}
            >
              <p className="m-0">{c}</p>
            </div>
          ))}
        </div>

        <div className="row">
          <p>Title *</p>
          <input
            type="text"
            placeholder="Blog title name"
            name="title"
            onChange={onChange}
            value={formData.title ?? ""}
            required
            className="border-[#dddddd] border-2 px-4 py-2 my-2 rounded-md"
          />
        </div>

        <div className="row">
          <p>Cover Image Url</p>
          <input
            type="text"
            placeholder="Blog Image Url, eg:https://imgur.com/12312"
            name="image"
            onChange={onChange}
            value={formData.image ?? ""}
            className="border-[#dddddd] w-[30vw] border-2 px-4 py-2 my-2 rounded-md"
          />
        </div>

        <div className="row">
          <p>Content *</p>
          <textarea
            minLength={200}
            name="body"
            onChange={onChange}
            value={formData.body ?? ""}
            placeholder="Blog content here"
            required
            className="border-[#dddddd] border-2 w-[50vw] px-4 py-2 my-2 rounded-md"
            rows={10}
          ></textarea>
        </div>

        <div className="row">
          <button
            type="submit"
            className="bg-primary flex justify-center items-center px-6 py-3 w-[10rem] text-white rounded-md"
          >
            {!loading ? (
              !edit ? (
                "Create Post"
              ) : (
                "Edit Post"
              )
            ) : (
              <div className="w-6 h-6 rounded-full spin loop"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
