export type DraftTone = "technical" | "conversational" | "formal";

export function getDraftToneInstruction(tone: DraftTone): string {
  switch (tone) {
    case "technical":
      return "Usá un tono directo y técnico. Sin frases de relleno. Máximo 2 oraciones antes de ir al punto.";
    case "formal":
      return "Usá un tono profesional y estructurado. Evitá contracciones y lenguaje informal.";
    case "conversational":
    default:
      return "Usá un tono amigable y natural. Suena como una persona real, no como un profesional corporativo.";
  }
}
