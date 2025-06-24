async function handler({ title, description }) {
  if (!title || !description) {
    return { error: "Title and description are required" };
  }

  const prompt = `Analyze this feature proposal for a CRM system designed for insurance brokers specializing in senior health insurance:

Title: ${title}
Description: ${description}

Please provide a comprehensive analysis focusing on CRM-specific benefits like lead management, sales automation, customer retention, and workflow optimization for insurance brokers.

Consider the specific context of senior health insurance sales, which typically involves:
- Complex products requiring detailed explanations
- Longer sales cycles
- Regulatory compliance requirements
- Need for personalized customer service
- Follow-up intensive processes

Provide your analysis in a structured format covering priority, complexity, business value, technical considerations, recommendations, and potential risks.`;

  try {
    const response = await fetch("/integrations/google-gemini-1-5/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        json_schema: {
          name: "crm_feature_analysis",
          schema: {
            type: "object",
            properties: {
              priority_score: {
                type: "number",
                minimum: 1,
                maximum: 10,
              },
              implementation_complexity: {
                type: "string",
                enum: ["low", "medium", "high"],
              },
              estimated_effort: {
                type: "string",
              },
              business_value: {
                type: "string",
              },
              technical_considerations: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              recommendations: {
                type: "string",
              },
              risks: {
                type: "string",
              },
              insurance_specific_benefits: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              compliance_considerations: {
                type: "string",
              },
            },
            required: [
              "priority_score",
              "implementation_complexity",
              "estimated_effort",
              "business_value",
              "technical_considerations",
              "recommendations",
              "risks",
              "insurance_specific_benefits",
              "compliance_considerations",
            ],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!response.ok) {
      return {
        error: `Gemini API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return { error: "No response from Gemini AI" };
    }

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      return { error: "Failed to parse AI response as JSON" };
    }

    return {
      success: true,
      analysis: analysis,
      raw_response: aiResponse,
    };
  } catch (error) {
    return { error: `Failed to analyze feature: ${error.message}` };
  }
}
export async function POST(request) {
  return handler(await request.json());
}