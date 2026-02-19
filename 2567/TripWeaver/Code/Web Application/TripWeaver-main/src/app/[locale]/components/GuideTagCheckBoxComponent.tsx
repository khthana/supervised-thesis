"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import CheckboxElement from "../interface/checkboxElement";
import TagCheckBoxComponentElement from "./TagCheckBoxComponentElement";

interface TagCheckboxComponentProps {
  element: CheckboxElement[];
  translationTagTitle: string;
  translationPrefix: string;
  maxHeight: number
  onCheckBoxSelect: (tags: CheckboxElement[]) => void;
}

export default function TagCheckBoxComponent({
  element: element,
  translationPrefix,
  translationTagTitle,
  maxHeight,
  onCheckBoxSelect,
}: TagCheckboxComponentProps) {
  const t = useTranslations();
  const [tagList, setTagList] = useState<CheckboxElement[]>(element);

  useEffect(() => {
    setTagList(element);
  }, [element]);

  const handleCheckboxClick = (tagsName: string) => {
    const updatedTags = tagList.map((tags) =>
      tags.name === tagsName ? { ...tags, selected: !tags.selected } : tags
    );
    setTagList(updatedTags);
    onCheckBoxSelect(updatedTags);
  };

  return (
    <>
      <div className="flex flex-col bg-[#F8F8F8] border border-[#E0E0E0] shadow-xl kanit p-5 w-full rounded-xl">
        <div className="flex text-sm">{t(translationTagTitle)}</div>
        <div className="flex flex-col">
          <ul style={{ maxHeight: `${maxHeight}px` }} className={`overflow-y-auto w-full`}>
            {tagList.map((tags, index) => (
              <li key={index}>
                <TagCheckBoxComponentElement
                  name={tags.name}
                  checked={tags.selected}
                  translationPrefix={translationPrefix}
                  onClick={handleCheckboxClick}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
