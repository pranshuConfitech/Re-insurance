// import React, { useEffect, useState } from 'react'

// import { ToggleButton, ToggleButtonGroup } from '@mui/lab'

// import { Toast } from 'primereact/toast'

// import Grid from '@mui/material/Grid'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'

// import { MemberService } from '@/services/remote-api/api/member-services/member.services'
// import { QuestionnaireService } from '@/services/remote-api/api/master-services/questionnaire.service'

// const questionnaireService = new QuestionnaireService()
// const memberservice = new MemberService()

// // Define types for better type safety
// interface Question {
//   id: number;
//   question: string;
//   // Add other relevant properties if they exist
// }

// interface Answers {
//   [questionId: number]: 'yes' | 'no' | string | undefined; // Allow string for initial empty state and undefined for missing answers
// }

// const MemberQuestionnair = ({ memberData }: { memberData: any }) => {
//   const [questionnaires, setQuestionnairs] = useState<Question[]>([]) // Use Question type
//   const [answers, setAnswers] = useState<Answers>({})
//   const toast: any = React.useRef(null)

//   // Ref to track the previous state of the specific questions being answered yes
//   // const prevAnsweredYesToSpecific = React.useRef<boolean | undefined>(undefined);
//   // Ref to track the previous answers for the specific questions
//   const prevSpecificAnswers = React.useRef<{ [key: number]: 'yes' | 'no' | string | undefined }>({});

//   // Memoize the IDs of the specific questions
//   const cancerQuestionId = React.useMemo(() => {
//     const foundItem = questionnaires.find(
//       (item) => item.question === "Cancer, growth or tumors whether benign or malignant"
//     );
//     // Explicitly check if the item was found and has an id before returning
//     return foundItem && typeof foundItem.id === 'number' ? foundItem.id : undefined;
//   }, [questionnaires]);

//   const cardiovascularQuestionId = React.useMemo(() => {
//     const foundItem = questionnaires.find(
//       (item) => item.question === "Cardiovascular (heart and blood vessels) disorders including high blood pressure"
//     );
//     // Explicitly check if the item was found and has an id before returning
//     return foundItem && typeof foundItem.id === 'number' ? foundItem.id : undefined;
//   }, [questionnaires]);

//   const handleToggle = (id: any, value: any) => {
//     setAnswers(prev => ({
//       ...prev,
//       [id]: value
//     }))
//   }

//   const dataSource$ = (pageRequest: any = {}) => {
//     if (memberData?.age) pageRequest.age = memberData?.age
//     if (memberData?.gender) pageRequest.gender = memberData?.gender

//     return questionnaireService.getMemberQuestionnaireList(pageRequest)
//   }

//   const saveQuestionnair = () => {
//     // Existing logic for showing general warning if no answers (re-adding based on previous state)
//     if (Object.entries(answers).length < 1) {
//       toast.current.show({
//         severity: 'warn',
//         summary: 'Warning',
//         detail: 'Please answer at least one question!!',
//         life: 3000
//       });
//       return;
//     }

//     const payload = Object.entries(answers).map(([questionId, answer]) => ({
//       questionId: Number(questionId),
//       answer: answer === 'yes' ? true : false
//     }))

//     memberservice.saveMemberQuestionnair(payload, memberData.id).subscribe({
//       next: response => {
//         console.log('Save successful', response)
//         toast.current.show({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Answers Updated Successfully!!',
//           life: 3000
//         })
//       },
//       error: error => {
//         console.error('Save failed', error)
//         toast.current.show({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Something went wrong',
//           life: 2000
//         })
//       }
//     })
//   }

//   useEffect(() => {
//     // This effect fetches the initial data
//     dataSource$().subscribe((pageData: any) => setQuestionnairs(pageData));

//     memberservice.getMemberQuestionnair(memberData.id).subscribe((savedAnswers: any) => {
//       const mappedAnswers: Answers = savedAnswers.reduce(
//         (acc: Answers, { questionId, answer }: { questionId: any; answer: any }) => {
//           acc[questionId] = answer ? 'yes' : 'no';
//           return acc;
//         },
//         {}
//       );
//       setAnswers(mappedAnswers);
//     });
//   }, [memberData.id]); // Only depends on memberData.id for initial fetch

//   useEffect(() => {
//     // This effect checks for specific answers and shows the toast after data is loaded
//     // Only proceed if questionnaires, answers, and both specific question IDs are available

//     // ADD THESE CONSOLE LOGS RIGHT BEFORE THE IF STATEMENT
//     console.log('Debugging before line 131:', { questionnaires, answers, cancerQuestionId, cardiovascularQuestionId });

//     // Only proceed if specific question IDs are defined
//     if (cancerQuestionId !== undefined && cardiovascularQuestionId !== undefined) {

//       // Safely get the current answer values for the specific questions
//       const currentCancerAnswer = answers[cancerQuestionId];
//       const currentCardiovascularAnswer = answers[cardiovascularQuestionId];

//       // Safely get the previous answer values for the specific questions from the ref
//       const prevCancerAnswer = prevSpecificAnswers.current[cancerQuestionId];
//       const prevCardiovascularAnswer = prevSpecificAnswers.current[cardiovascularQuestionId];

//       // Check if either current answer is 'yes'
//       const currentlyAnsweredYesToSpecific =
//         (currentCancerAnswer === 'yes') ||
//         (currentCardiovascularAnswer === 'yes');

//       // Check if either previous answer was 'yes'
//       const previouslyAnsweredYesToSpecific =
//         (prevCancerAnswer === 'yes') ||
//         (prevCardiovascularAnswer === 'yes');

//       // Check if either specific question just became 'yes'
//       const cancerJustBecameYes = (prevCancerAnswer !== 'yes' && currentCancerAnswer === 'yes');
//       const cardiovascularJustBecameYes = (prevCardiovascularAnswer !== 'yes' && currentCardiovascularAnswer === 'yes');

//       // Show toast if either specific question just became 'yes'
//       if (cancerJustBecameYes || cardiovascularJustBecameYes) {
//         toast.current.show({
//           severity: 'warn',
//           summary: 'Medical Test is required.',
//           detail: 'Detail will be shared in email.',
//           life: 5000
//         });
//       }

//       // Update the ref with the current specific answers for the next render
//       prevSpecificAnswers.current[cancerQuestionId] = currentCancerAnswer;
//       prevSpecificAnswers.current[cardiovascularQuestionId] = currentCardiovascularAnswer;

//     } else if (questionnaires.length > 0) {
//       // Optional: Log a warning if the specific questions were not found after questionnaires loaded
//       console.warn("Specific medical questions not found in the loaded questionnaire data.", { cancerQuestionId, cardiovascularQuestionId });
//       // Also clear the ref if the specific questions are not found
//       prevSpecificAnswers.current = {};
//     }

//   }, [questionnaires, answers, cancerQuestionId, cardiovascularQuestionId]); // Depend on questionnaires, answers, and the question IDs

//   console.log(questionnaires);
//   console.log(answers);

//   return (
//     <>
//       <Toast ref={toast} />
//       <Grid container>
//         {questionnaires.map(({ id, question }) => (
//           <Grid item xs={12} sm={6} md={3} key={id}>
//             <Typography variant='h6'>{question}</Typography>
//             <ToggleButtonGroup
//               color='primary'
//               value={id in answers ? answers[id] : ''}
//               exclusive
//               onChange={(e, value) => handleToggle(id, value)}
//               aria-label={`question-${id}`}
//             >
//               <ToggleButton size='small' value='yes' aria-label='yes'>
//                 Yes
//               </ToggleButton>
//               <ToggleButton size='small' value='no' aria-label='no'>
//                 No
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </Grid>
//         ))}
//         <Grid item xs={12} container style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <Button color='secondary' onClick={() => saveQuestionnair()}>
//             Save
//           </Button>
//         </Grid>
//       </Grid>
//     </>
//   )
// }

// export default MemberQuestionnair


import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { Toast } from 'primereact/toast'

import { MemberService } from '@/services/remote-api/api/member-services/member.services'
import { QuestionnaireService } from '@/services/remote-api/api/master-services/questionnaire.service'

const questionnaireService = new QuestionnaireService()
const memberservice = new MemberService()

interface Question {
  id: number
  question: string
}

interface Answers {
  [questionId: number]: 'yes' | 'no' | undefined
}

const MemberQuestionnair = ({ memberData }: { memberData: any }) => {
  const [questionnaires, setQuestionnairs] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const toast: any = useRef(null)
  const prevSpecificAnswers = useRef<Answers>({})

  // Get special question IDs
  const cancerQuestionId = useMemo(
    () => questionnaires.find(q => q.question.includes("Cancer"))?.id,
    [questionnaires]
  )
  const cardiovascularQuestionId = useMemo(
    () => questionnaires.find(q => q.question.includes("Cardiovascular"))?.id,
    [questionnaires]
  )

  const handleToggle = (id: number, value: 'yes' | 'no') => {
    if (!value) return
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const saveQuestionnair = () => {
    if (Object.keys(answers).length < 1) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please answer at least one question!',
        life: 3000
      })
      return
    }

    const payload = Object.entries(answers).map(([id, ans]) => ({
      questionId: Number(id),
      answer: ans === 'yes'
    }))

    memberservice.saveMemberQuestionnair(payload, memberData.id).subscribe({
      next: () =>
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Answers saved successfully!',
          life: 3000
        }),
      error: () =>
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong.',
          life: 2000
        })
    })
  }

  // Fetch data
  useEffect(() => {
    questionnaireService.getMemberQuestionnaireList({
      age: memberData?.age,
      gender: memberData?.gender
    }).subscribe((res: any) => setQuestionnairs(res))

    memberservice.getMemberQuestionnair(memberData.id).subscribe((saved: any) => {
      const mapped: Answers = saved.reduce(
        (acc: Answers, { questionId, answer }: any) => {
          acc[questionId] = answer ? 'yes' : 'no'
          return acc
        },
        {}
      )
      setAnswers(mapped)
    })
  }, [memberData?.id])

  // Watch for "yes" in special questions
  useEffect(() => {
    if (cancerQuestionId && cardiovascularQuestionId) {
      const currentCancer = answers[cancerQuestionId]
      const currentCardio = answers[cardiovascularQuestionId]
      const prevCancer = prevSpecificAnswers.current[cancerQuestionId]
      const prevCardio = prevSpecificAnswers.current[cardiovascularQuestionId]

      if (
        (prevCancer !== 'yes' && currentCancer === 'yes') ||
        (prevCardio !== 'yes' && currentCardio === 'yes')
      ) {
        toast.current.show({
          severity: 'warn',
          summary: 'Medical Test Required',
          detail: 'Details will be shared via email.',
          life: 5000
        })
      }

      prevSpecificAnswers.current[cancerQuestionId] = currentCancer
      prevSpecificAnswers.current[cardiovascularQuestionId] = currentCardio
    }
  }, [answers, cancerQuestionId, cardiovascularQuestionId])

  return (
    <>
      <Toast ref={toast} />
      <Grid container spacing={3}>
        {questionnaires.map(({ id, question }) => (
          <Grid item xs={12} sm={6} md={4} key={id}>
            <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-all">
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  {question}
                </Typography>
                <ToggleButtonGroup
                  value={answers[id] || ''}
                  exclusive
                  onChange={(e, value) => handleToggle(id, value)}
                >
                  <ToggleButton
                    value="yes"
                    sx={{ px: 3, py: 1, borderRadius: 2 }}
                  >
                    Yes
                  </ToggleButton>
                  <ToggleButton
                    value="no"
                    sx={{ px: 3, py: 1, borderRadius: 2 }}
                  >
                    No
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2, borderRadius: 2, textTransform: 'none', px: 4 }}
            onClick={saveQuestionnair}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default MemberQuestionnair
