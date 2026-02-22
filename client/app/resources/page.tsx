"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { RawArticle, Article } from "@/types/Blog";
import { Header } from "@/components/header";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    fetchArticles();
  }, []);
  const fetchArticles = async () => {
    let res = await api.get<Article[]>("blogs/allBlogs");
    let data = res.data;
    const parsedArticles: Article[] = data.map((article) => ({
      ...article,
      date: new Date(article.date),
    }));
    setArticles(parsedArticles);
  };

  return (
    <div className="bg-accent min-h-screen box-border">
      <Header />
      <div className=" px-12 py-4">
        <div className="flex flex-wrap gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

function truncateWords(text: string, limit: number) {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "…";
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <>
      <div
        key={article.id}
        className="group rounded-xl max-w-[30vw] overflow-hidden bg-white shadow-sm border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1"
      >
        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">
          {/* Category */}
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {article.category}
          </span>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900">
            {truncateWords(article.title, 12)}
          </h2>

          {/* Body (preview) */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {truncateWords(article.body, 30)}
          </p>

          {/* Footer */}
          <div className="pt-3 text-xs text-gray-500 border-t border-gray-200">
            By {article.authorName}
          </div>
        </div>
      </div>
    </>
  );
}
