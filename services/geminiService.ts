
import { GoogleGenAI } from "@google/genai";
import { DesignParams } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

export const generateSportsPrint = async (params: DesignParams): Promise<{ imageUrl: string; prompt: string }> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  const { text, sport, colors, style, mode, referenceImage } = params;

  // Visual Dimension Logic
  const dimensionInstruction = mode === '3D' 
    ? "RENDER STYLE: 3D Render, volumetric lighting, realistic materials, depth of field, octane render, high fidelity textures."
    : "RENDER STYLE: 2D Flat Vector, clean lines, no shadows, no gradients, solid flat colors, SVG style, minimalistic.";

  // Specific instruction if an image is provided
  const mixerInstruction = referenceImage 
    ? "REFERENCE IMAGE INSTRUCTION: A reference image has been provided. You MUST incorporate the subject/shape from this image into the design. Do NOT just paste it; REDRAW, STYLIZE and INTEGRATE it completely to match the requested Visual Style. The image should act as the mascot, icon, or texture within the typography composition."
    : "No reference image provided. Create a unique graphic element or mascot based on the text and sport context.";

  // Prompt Engineering for Text-Heavy Sports Designs
  const prompt = `
    Create a professional sports typography design.
    Subject Text: "${text}"
    NOTE: If the Subject Text contains newlines/multiple lines, strictly render the design with the text stacked vertically (one word/phrase per line) as requested.
    
    Sport Context: ${sport} (Ice Hockey Theme)
    Visual Style: ${style}
    Mode: ${mode}
    ${dimensionInstruction}
    ${mixerInstruction}
    
    COLOR PALETTE INSTRUCTIONS:
    Use STRICTLY the following colors: ${colors}.
    Do NOT use random colors. Apply the provided hex codes accurately.
    
    CRITICAL REQUIREMENTS:
    1. The background MUST be PURE WHITE (#FFFFFF).
    2. The design is a text-based print suitable for t-shirts or merchandise.
    3. Use bold, dynamic fonts associated with the sport style.
    4. High contrast between text and background.
    5. Clean edges.
    6. Center the design.
    7. Isolate the design completely on the white background.
    8. The colors provided must be the dominant colors of the graphic elements.
    9. If 2D mode, ensure there is absolutely no shading or 3D effects.
  `;

  // Construct parts for Gemini (Text + optional Image)
  const parts: any[] = [{ text: prompt }];

  if (referenceImage) {
    // Extract base64 data (remove data:image/xxx;base64, prefix)
    const base64Data = referenceImage.split(',')[1];
    if (base64Data) {
      parts.push({
        inlineData: {
          mimeType: 'image/png', // Assuming PNG or compatible format from FileReader
          data: base64Data
        }
      });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    let imageUrl = '';
    const responseParts = response.candidates?.[0]?.content?.parts;

    if (responseParts) {
      for (const part of responseParts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from the API.");
    }

    return { imageUrl, prompt };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
