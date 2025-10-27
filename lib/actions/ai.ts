"use server"

import OpenAI from "openai"
import { createMessage, getNodeContext } from "./notes"

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API,
})

/**
 * Process a user message and get AI response
 */
export async function processAIMessage(nodeId: string) {
  try {
    // Get the full conversation context
    const context = await getNodeContext(nodeId)

    // Convert to OpenAI format
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = context.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }))

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    })

    const assistantMessage = completion.choices[0].message.content || ""
    const tokensUsed = completion.usage?.total_tokens || 0

    // Save the assistant's response
    const savedMessage = await createMessage(
      nodeId,
      "assistant",
      assistantMessage,
      completion.model,
      tokensUsed,
      {
        finish_reason: completion.choices[0].finish_reason,
      }
    )

    return {
      success: true,
      message: savedMessage,
    }
  } catch (error) {
    console.error("Error processing AI message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process message",
    }
  }
}

/**
 * Stream AI response (for real-time streaming)
 */
export async function streamAIMessage(nodeId: string) {
  try {
    const context = await getNodeContext(nodeId)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = context.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }))

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    })

    return stream
  } catch (error) {
    console.error("Error streaming AI message:", error)
    throw error
  }
}

