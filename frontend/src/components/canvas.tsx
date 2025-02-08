"use client";

import { Suspense } from "react";
import { ChatWindow } from "./chat-window";
import * as Skeletons from "@/components/skeletons";
import { AvailableAgents } from "./coagents-provider";
import { useCoAgent } from "@copilotkit/react-core";
import { Loader2, CircleOff } from "lucide-react";
import * as Agents from "@/components/agents";
const getCurrentlyRunningAgent = (
  state: Array<{
    status: boolean;
    name: string;
    nodeName: string;
  }>
) => {
  const agent = state.find((agent) => agent.status);
  // modify agent that is called agent to research agent
  if (agent?.name === "agent") {
    // THIS IS ONLY FOR UI PURPOSES
    return { ...agent, name: "research" };
  }
  return agent;
};

const DefaultView = () => (
  <div className="flex items-center justify-center h-full text-gray-600">
    <p className="text-2xl text-center font-serif italic max-w-3xl">
      No agent running. Start a conversation in the chat to begin planning your
      trip, researching topics!
    </p>
  </div>
);

export default function Canvas() {
  const {
    running: travelAgentRunning,
    name: travelAgentName,
    nodeName: travelAgentNodeName,
  } = useCoAgent({
    name: AvailableAgents.TRAVEL_AGENT,
  });

  const {
    running: researchAgentRunning,
    name: researchAgentName,
    nodeName: researchAgentNodeName,
  } = useCoAgent({
    name: AvailableAgents.RESEARCH_AGENT,
  });

  const currentlyRunningAgent = getCurrentlyRunningAgent([
    {
      status: travelAgentRunning,
      name: travelAgentName,
      nodeName: travelAgentNodeName ?? "",
    },
    {
      status: researchAgentRunning,
      name: researchAgentName,
      nodeName: researchAgentNodeName ?? "",
    },
  ]);

  return (
    <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-12">
      {currentlyRunningAgent?.status ? (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse z-[9999]">
          <span className="font-bold">
            <Loader2 className="inline-block w-4 h-4 mr-2 animate-spin" />
            {currentlyRunningAgent.name} agent executing{" "}
            {currentlyRunningAgent.nodeName} node
          </span>{" "}
        </div>
      ) : (
        <div className="absolute top-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-full shadow-lg z-[9999]">
          <CircleOff className="inline-block w-4 h-4 mr-2 animate-spin" />
          <span className="font-bold">No Agent Running</span>
        </div>
      )}
      <div className="order-last md:order-first md:col-span-4 p-4 border-r h-screen overflow-y-auto">
        <ChatWindow />
      </div>

      <div className="order-first md:order-last md:col-span-8 bg-white p-8 overflow-y-auto">
        <div className="space-y-8 h-full">
          <Suspense fallback={<Skeletons.EmailListSkeleton />}>
            <div className="h-full">
              <Agents.TravelAgent />
              <Agents.ResearchAgent />
              {!currentlyRunningAgent?.status && <DefaultView />}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
