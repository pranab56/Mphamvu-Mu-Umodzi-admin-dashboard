"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Heading } from "@tiptap/extension-heading";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Link } from "@tiptap/extension-link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Bold, Italic, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Undo, Redo, Link2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  title: string;
  subtitle?: string;
  defaultContent: string;
}

export default function LegalEditorPage({ title, subtitle, defaultContent }: Props) {
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ blockquote: false, heading: false }),
      Underline,
      TextStyle,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
    ],
    content: defaultContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] px-6 py-5 focus:outline-none text-gray-800 leading-relaxed",
      },
    },
  });

  const handleSave = () => {
    const html = editor?.getHTML();
    console.log("Save content:", html);
    toast.success(`${title} saved successfully!`);
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title: tip,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      title={tip}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-2 rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-[#A53200] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="w-full py-6 pb-10">
      <div className="w-full flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <button
                onClick={() => router.back()}
                className="w-8 h-8 rounded-full bg-[#EAECEF] hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
              </button>
              <h1 className="text-[26px] font-extrabold text-[#111827]">{title}</h1>
            </div>
            {subtitle && (
              <p className="text-[13px] text-gray-400 font-medium ml-11">{subtitle}</p>
            )}
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#A53200] text-white text-[13px] font-bold rounded-xl hover:bg-[#007BB5] transition-colors cursor-pointer shadow-sm shadow-[#A53200]/20"
          >
            <Save className="w-4 h-4" strokeWidth={2.5} />
            Save Changes
          </button>
        </div>

        {/* Editor Card */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            {/* Undo / Redo */}
            <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="Undo">
              <Undo className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="Redo">
              <Redo className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Headings */}
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor?.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor?.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor?.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Inline formatting */}
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              active={editor?.isActive("bold")}
              title="Bold"
            >
              <Bold className="w-4 h-4" strokeWidth={2.5} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              active={editor?.isActive("italic")}
              title="Italic"
            >
              <Italic className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              active={editor?.isActive("underline")}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              active={editor?.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              active={editor?.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              active={editor?.isActive("blockquote")}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              active={editor?.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              active={editor?.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              active={editor?.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Link */}
            <ToolbarButton
              onClick={addLink}
              active={editor?.isActive("link")}
              title="Insert Link"
            >
              <Link2 className="w-4 h-4" strokeWidth={2} />
            </ToolbarButton>
          </div>

          {/* Editor body */}
          <EditorContent editor={editor} />

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">
              {editor?.storage?.characterCount?.characters?.() ?? 0} characters
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Last saved: just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
