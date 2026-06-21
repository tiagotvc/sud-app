"use client";

import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TEXT_COLORS = [
  { name: "Preto", value: "#0f172a", swatch: "bg-slate-900" },
  { name: "Azul", value: "#1d4ed8", swatch: "bg-blue-700" },
  { name: "Vermelho", value: "#dc2626", swatch: "bg-red-600" },
  { name: "Verde", value: "#16a34a", swatch: "bg-green-600" },
  { name: "Roxo", value: "#7c3aed", swatch: "bg-violet-600" },
  { name: "Laranja", value: "#ea580c", swatch: "bg-orange-600" },
];

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "announcements-editor min-h-36 px-4 py-3 text-sm text-slate-900 outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const currentColor =
    (editor.getAttributes("textStyle").color as string | undefined) ?? "#0f172a";

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="overflow-hidden rounded-lg border border-amber-200/80 bg-amber-50/30 ring-1 ring-amber-100">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-amber-200/60 bg-amber-50/80 px-3 py-2">
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="N"
            title="Negrito"
          />
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="I"
            title="Itálico"
          />
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            label="• Lista"
            title="Lista com marcadores"
          />
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            label="1. Lista"
            title="Lista numerada"
          />

          <span className="mx-1 h-5 w-px bg-amber-200" aria-hidden />

          <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/70">
            Cor
          </span>
          {TEXT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.name}
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${color.swatch} ${
                currentColor === color.value ? "border-amber-900 ring-2 ring-amber-300" : "border-white"
              }`}
            />
          ))}
          <button
            type="button"
            title="Remover cor"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="rounded-md border border-amber-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-amber-100"
          >
            Limpar
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  title,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
        active
          ? "bg-amber-700 text-white shadow-sm"
          : "bg-white text-slate-700 ring-1 ring-amber-200 hover:bg-amber-100"
      }`}
    >
      {label}
    </button>
  );
}
