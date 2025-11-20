/**
 * CKEditor 5 + Bubble Bridge — Full Production File
 *  - AI enabled
 *  - No RTC
 *  - Bubble → Editor LOAD_CONTENT support
 *  - Editor → Bubble CONTENT_UPDATE support
 *  - Decoupled editor + menu bar
 */

console.log("🟦 MAIN.JS LOADED");

const BRIDGE_ID = "CKE_BUBBLE_BRIDGE_V1";

// --------------------------------------------------------
// EARLY LISTENER: must exist before editor is ready
// --------------------------------------------------------
(function forceMessageListenerBinding() {
    console.log("🧬 Binding LOAD_CONTENT listener inside CKEditor iframe");

    window.addEventListener("message", (event) => {
        const msg = event.data;
        if (!msg || msg.bridge !== BRIDGE_ID) return;

        console.log("📥 main.js received (EARLY LISTENER):", msg);

        if (msg.type === "LOAD_CONTENT") {
            const safeHtml =
                msg.payload && typeof msg.payload.html === "string"
                    ? msg.payload.html
                    : "";

            console.log("🟦 Applying LOAD_CONTENT to CKEditor…");

            try {
                // Only treat editor as ready if setData exists and is a function
                if (!window.editor || typeof window.editor.setData !== "function") {
                    console.warn("⚠️ Editor not ready or invalid — caching LOAD_CONTENT");
                    window._pendingLoadContent = safeHtml;
                    return;
                }

                window.suppressEditorEvents = true;
                window.editor.setData(safeHtml);
                window.suppressEditorEvents = false;

                console.log("✔️ CKEditor content updated by Bubble (early listener)");
            } catch (err) {
                console.error("❌ Failed setData, caching instead:", err);
                // Cache anyway so the real editor can consume it later
                window._pendingLoadContent = safeHtml;
            }
        }
    });
})();

// --------------------------------------------------------
// Apply pending content once the REAL editor exists
// --------------------------------------------------------
function applyPendingLoad() {
    if (!window._pendingLoadContent) {
        console.log("ℹ️ No pending LOAD_CONTENT to apply");
        return;
    }

    if (!window.editor || typeof window.editor.setData !== "function") {
        console.warn("⚠️ Editor still not ready / invalid in applyPendingLoad()");
        return;
    }

    console.log("🟦 Applying delayed LOAD_CONTENT...");
    try {
        window.suppressEditorEvents = true;
        window.editor.setData(window._pendingLoadContent);
    } catch (err) {
        console.error("❌ Failed to applyPendingLoad:", err);
        return;
    } finally {
        window.suppressEditorEvents = false;
        window._pendingLoadContent = null;
    }
}

// --------------------------------------------------------
// ENV VARIABLES
// --------------------------------------------------------
const LICENSE_KEY =
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjQyMDE1OTksImp0aSI6ImNiMWJiNTk0LWIxODEtNGJmMi1iZTA5LTM2ZGM1MjY3MzIxZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImFhNmQ1YmUwIn0.a4QCfokW3f4OX2Td4j7I5Nv6J9NsaWg4atvrEmD90ijhttvsbqFMfaoJ4a-X_V0ZJ0mxSN6mMf1jjWLJGlV0dQ';

const TOKEN_URL =
    'https://uplnolydjmzr.cke-cs.com/token/dev/9dcdd882883e3315126ce6f9865e9ec42fa58287442ece2a12be481798c5?limit=10';

document.addEventListener("DOMContentLoaded", () => {
    console.log("🟩 DOM READY — #editor:", document.querySelector("#editor"));
});

// --------------------------------------------------------
// LOAD PLUGINS — CKBuilder preset
// --------------------------------------------------------
const {
    DecoupledEditor,
    Autosave,
    Essentials,
    Paragraph,
    CloudServices,
    Autoformat,
    TextTransformation,
    LinkImage,
    Link,
    ImageBlock,
    ImageToolbar,
    BlockQuote,
    Bold,
    Bookmark,
    CKBox,
    ImageUpload,
    ImageInsert,
    ImageInsertViaUrl,
    AutoImage,
    PictureEditing,
    CKBoxImageEdit,
    CodeBlock,
    TableColumnResize,
    Table,
    TableToolbar,
    Emoji,
    Mention,
    PasteFromOffice,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    HorizontalLine,
    ImageCaption,
    ImageResize,
    ImageStyle,
    Indent,
    IndentBlock,
    Code,
    Italic,
    AutoLink,
    ListProperties,
    List,
    MediaEmbed,
    RemoveFormat,
    SpecialCharactersArrows,
    SpecialCharacters,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    TableCaption,
    TableCellProperties,
    TableProperties,
    Alignment,
    TodoList,
    Underline,
    BalloonToolbar
} = window.CKEDITOR;

const {
    AIChat,
    AIEditorIntegration,
    AIQuickActions,
    AIReviewMode,
    PasteFromOfficeEnhanced,
    FormatPainter,
    LineHeight,
    SlashCommand
} = window.CKEDITOR_PREMIUM_FEATURES;

// --------------------------------------------------------
// Helper: send message to Bubble parent
// --------------------------------------------------------
if (typeof window.sendToParent !== "function") {
    window.sendToParent = function(type, payload = {}) {
        const message = {
            bridge: BRIDGE_ID,
            type,
            payload
        };

        try {
            window.parent.postMessage(message, "*");
        } catch (e) {
            console.error("❌ main.js parent.postMessage failed:", e);
        }
    };
}

// --------------------------------------------------------
// CONFIGURATION (NO RTC, WITH AI)
// --------------------------------------------------------
const DOCUMENT_ID = "fv-doc-1";

const editorConfig = {
    toolbar: {
        items: [
            "undo", "redo", "|",
            "toggleAi", "aiQuickActions", "|",
            "formatPainter", "findAndReplace", "|",
            "heading", "|",
            "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "|",
            "bold", "italic", "underline", "strikethrough",
            "subscript", "superscript", "code", "removeFormat", "|",
            "emoji", "specialCharacters", "horizontalLine",
            "link", "bookmark",
            "insertImage", "insertImageViaUrl", "ckbox",
            "mediaEmbed", "insertTable", "blockQuote", "codeBlock", "|",
            "alignment", "lineHeight", "|",
            "bulletedList", "numberedList", "todoList",
            "outdent", "indent"
        ]
    },

    plugins: [
        AIChat,
        AIEditorIntegration,
        AIQuickActions,
        AIReviewMode,
        Alignment,
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BalloonToolbar,
        BlockQuote,
        Bold,
        Bookmark,
        CKBox,
        CKBoxImageEdit,
        CloudServices,
        Code,
        CodeBlock,
        Emoji,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        FormatPainter,
        Heading,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        LineHeight,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        PasteFromOfficeEnhanced,
        PictureEditing,
        RemoveFormat,
        SlashCommand,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline
    ],

    ai: {
        container: { type: "overlay", side: "right" }
    },

    cloudServices: {
        tokenUrl: TOKEN_URL
    },

    collaboration: {
        channelId: DOCUMENT_ID
    },

    placeholder: "Type or paste your content here!",
    licenseKey: LICENSE_KEY
};

// --------------------------------------------------------
// CREATE EDITOR
// --------------------------------------------------------
console.log("🟦 Calling DecoupledEditor.create()...");

DecoupledEditor.create(document.querySelector("#editor"), editorConfig)
    .then(editor => {
        console.log("🟩 EDITOR CREATED SUCCESSFULLY", editor);

        document
            .querySelector("#editor-toolbar")
            .appendChild(editor.ui.view.toolbar.element);
        document
            .querySelector("#editor-menu-bar")
            .appendChild(editor.ui.view.menuBarView.element);

        window.editor = editor;
        window.suppressEditorEvents = false;

        // Apply pending content once the editor has rendered at least once
        editor.editing.view.once("render", () => {
            console.log("✨ Editor fully rendered — applying pending content (if any)");
            applyPendingLoad();
        });

        // Tell Bubble that the iframe + editor are fully ready
        window.sendToParent("IFRAME_READY", { timestamp: Date.now() });
        window.sendToParent("EDITOR_READY", { timestamp: Date.now() });

        // Editor → Bubble
        editor.model.document.on("change:data", () => {
            if (window.suppressEditorEvents) return;

            const html = editor.getData();
            console.log("🟧 CONTENT_UPDATE:", html.slice(0, 120));
            window.sendToParent("CONTENT_UPDATE", { html });
        });
    })
    .catch(err => {
        console.error("❌ EDITOR FAILED TO INITIALIZE:", err);
    });

// Disable CKEditor trial popup
function configUpdateAlert() {}