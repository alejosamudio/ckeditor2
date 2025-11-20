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

/* ------------------------------------------------------------------
   🔥 CRITICAL FIX:
   WE MUST ATTACH A MESSAGE LISTENER IMMEDIATELY, BEFORE EDITOR LOADS
   This ensures LOAD_CONTENT reaches THIS iframe, not Bubble's wrapper.
------------------------------------------------------------------- */
(function forceMessageListenerBinding() {
	console.log("🧬 Binding LOAD_CONTENT listener inside CKEditor iframe");

	window.addEventListener("message", (event) => {
		const msg = event.data;
		if (!msg || msg.bridge !== BRIDGE_ID) return;

		console.log("📥 main.js received (EARLY LISTENER):", msg);

		if (msg.type === "LOAD_CONTENT") {
			console.log("🟦 Applying LOAD_CONTENT to CKEditor…");

			try {
				if (!window.editor) {
					console.warn("⚠️ Editor not ready yet — delaying LOAD_CONTENT");
					window._pendingLoadContent = msg.payload.html;
					return;
				}

				window.suppressEditorEvents = true;
				window.editor.setData(msg.payload.html || "");
				window.suppressEditorEvents = false;

				console.log("✔️ CKEditor content updated by Bubble (early listener)");
			} catch (err) {
				console.error("❌ Failed setData:", err);
			}
		}
	});
})();

/* ------------------------------------------------------------------
   When editor becomes ready, apply any delayed LOAD_CONTENT
------------------------------------------------------------------- */
function applyPendingLoad() {
	if (window._pendingLoadContent && window.editor) {
		console.log("🟦 Applying delayed LOAD_CONTENT...");
		window.suppressEditorEvents = true;
		window.editor.setData(window._pendingLoadContent);
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
	window.sendToParent = function (type, payload = {}) {
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

		document.querySelector("#editor-toolbar").appendChild(editor.ui.view.toolbar.element);
		document.querySelector("#editor-menu-bar").appendChild(editor.ui.view.menuBarView.element);

		window.editor = editor;
		window.suppressEditorEvents = false;

		// Apply pending content if Bubble sent LOAD_CONTENT too early
		applyPendingLoad();

		// Notify Bubble
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
