import React, { Suspense } from 'react'

import Agents from '@/views/apps/agent_management/agents';

function Agent_Management() {

  return (
    <Suspense fallback={null}>
      <Agents/>
    </Suspense>

  )
}

export default Agent_Management;
