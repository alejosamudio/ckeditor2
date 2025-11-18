/**
 * CKEditor 5 + Bubble Bridge — Full Production File
 * Includes:
 *  - AI
 *  - No RTC
 *  - Bubble → Editor LOAD_CONTENT support
 *  - Editor → Bubble CONTENT_UPDATE support
 *  - Decoupled editor + menu bar
 */

console.log("🟦 MAIN.JS LOADED");

// --------------------------------------------------------
// ENV VARIABLES
// --------------------------------------------------------
const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjQyMDE1OTksImp0aSI6ImNiMWJiNTk0LWIxODEtNGJmMi1iZTA5LTM2ZGM1MjY3MzIxZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImFhNmQ1YmUwIn0.a4QCfokW3f4OX2Td4j7I5Nv6J9NsaWg4atvrEmD90ijhttvsbqFMfaoJ4a-X_V0ZJ0mxSN6mMf1jjWLJGlV0dQ';

const TOKEN_URL =
	'https://uplnolydjmzr.cke-cs.com/token/dev/9dcdd882883e331512ce6f9865e9ec42fa58287442ece2a12be481798c5?limit=10';

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

console.log("🟦 CKEDITOR UMD Loaded? ", !!window.CKEDITOR);
console.log("🟦 PREMIUM UMD Loaded? ", !!window.CKEDITOR_PREMIUM_FEATURES);

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

	// Required by AIChat (no RTC needed)
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

		document.querySelector("#editor-toolbar").appendChild(editor.ui.view.toolbar.element);
		document.querySelector("#editor-menu-bar").appendChild(editor.ui.view.menuBarView.element);

		// Expose globally (still useful for debugging)
		window.editor = editor;
		window.suppressEditorEvents = false;

		// 🔁 Bubble → Editor: listen for LOAD_CONTENT *after* editor exists
		window.addEventListener("message", (event) => {
			const msg = event.data;
			if (!msg || msg.bridge !== "CKE_BUBBLE_BRIDGE_V1") return;

			console.log("📥 main.js received from Bubble:", msg);

			if (msg.type === "LOAD_CONTENT") {
				console.log("🟦 Applying LOAD_CONTENT to CKEditor…");
				try {
					window.suppressEditorEvents = true;
					editor.setData(msg.payload.html);   // use captured editor instance
					window.suppressEditorEvents = false;
					console.log("✔️ CKEditor content updated by Bubble");
				} catch (err) {
					console.error("❌ Failed setData:", err);
				}
			}
		});

		// Editor → Bubble
		editor.model.document.on("change:data", () => {
			if (window.suppressEditorEvents) return;

			const html = editor.getData();
			console.log("🟧 CONTENT_UPDATE:", html.slice(0, 120));

			if (window.sendToParent) {
				window.sendToParent("CONTENT_UPDATE", { html });
			}
		});

		// Notify Bubble that editor is ready
		if (window.sendToParent) {
			console.log("🟦 SENDING EDITOR_READY → parent");
			window.sendToParent("EDITOR_READY", { timestamp: Date.now() });
		}
	})
	.catch(err => {
		console.error("❌ EDITOR FAILED TO INITIALIZE:", err);
	});

// Disable trial popup helper (no-op, but kept to avoid errors)
function configUpdateAlert() {}