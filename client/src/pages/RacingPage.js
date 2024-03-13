import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Input,
  Typography,
  formControlLabelClasses,
} from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { roomSelector } from '../redux/roomSlice'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import {
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from '@apollo/client'
import { START_ROOM } from '../graphql/querys'
import { DETACH_ROOM, SEND_RANK } from '../graphql/mutations'

const NEW_PARAGRAPH_SUBSCRIPTION = gql`
  subscription NewParagraph($roomId: String!) {
    newParagraph(roomId: $roomId) {
      Paragraph
    }
  }
`
const NEW_USER_SUBSCRIPTION = gql`
  subscription newUser($roomId: String!) {
    newUser(roomId: $roomId) {
      ID
      username
    }
  }
`
const NEW_RANK_SUBSCRIPTION = gql`
  subscription newRank($roomId: String!) {
    newRank(roomId: $roomId) {
      rank
      ID
      roomId
    }
  }
`

function RacingPage() {
  const room = useSelector(roomSelector)
  const navigation = useNavigate()
  const { id } = useParams()
  const [CarImages, setCarImages] = useState([])

  // const { data, loading, error } = useSubscription(NEW_PARAGRAPH_SUBSCRIPTION)
  const { data, loading, error } = useSubscription(NEW_USER_SUBSCRIPTION, {
    variables: { roomId: id },
  })

  const {
    data: RankData,
    loading: RankLoading,
    error: RankError,
  } = useSubscription(NEW_RANK_SUBSCRIPTION, {
    variables: { roomId: id },
  })

  const {
    data: Paragraph,
    loading: ParagraphLoading,
    error: ParagraphError,
  } = useSubscription(NEW_PARAGRAPH_SUBSCRIPTION, {
    variables: { roomId: id },
  })

  const [
    detachMutation,
    { loading: detachLoading, error: detachError, data: detachData },
  ] = useMutation(DETACH_ROOM)

  useEffect(() => {
    if (room && room.ID === id) {
      const updatedCarImages = room.members.map((member, index) => ({
        uri: `/static/cars/car_${index}.png`,
        ID: member.ID,
        username: member.username,
        margin: 0,
        rank: 0,
      }))
      setCarImages(updatedCarImages)
    } else {
      navigation('/')
    }
  }, [room, id]) 

  const [initialText, setInitialText] = useState(`Waiting ...`)

  const [value, setValue] = useState(initialText)
  const [value2, setValue2] = useState(initialText)
  const [rightChar, setRightChar] = useState([])
  const [TextLength, setTextLength] = useState(null)
  const [freeze, setFreez] = useState(false)
  const [inputType, setInputType] = useState(null)

  const { user } = useAuth()

  useEffect(() => {
    setValue(initialText)
  }, [initialText])

  useEffect(() => {
    if (Paragraph) {
      setInitialText(Paragraph.newParagraph.Paragraph)
      console.log(Paragraph.newParagraph.Paragraph)
    }
  }, [Paragraph])
  useEffect(() => {
    // if (userError) console.log(userError)
    if (RankData) {
      const updatedCarImages = CarImages.map((car, index) => ({
        ...car,
        margin:
          car.ID === RankData.newRank.ID ? RankData.newRank.rank : car.margin,
      }))

      setCarImages(updatedCarImages)
    }
  }, [RankData])

  useEffect(() => {
    // if (userError) console.log(userError)
    if (data) {
      if (!CarImages.some((value) => value.ID === data.newUser.ID)) {
        console.log('TOPOLSHA')
        setCarImages([
          ...CarImages,
          {
            uri: `/static/cars/car_${CarImages.length}.png`,
            ID: data.newUser.ID,
            username: data.newUser.username,
            margin: 0,
            rank: 0,
          },
        ])
      }
    }
  }, [data])

  const handleInputChange = (event) => {
    if (event.nativeEvent.inputType == 'insertText') {
      setInputType('yes')
      console.log('yes')
    } else {
      setInputType('no')
      setFreez(false)
    }
    setValue2(event.target.value)

    const inputValue = event.target.value
    const coloredText = Array.from(initialText).map((char, index) => {
      if (index < inputValue.length) {
        const inputChar = inputValue[index]
        const initialChar = char
        const initialChasr = initialText.split('')
        const correctChars = initialChasr.filter(
          (char, index) => char === inputValue[index],
        )
        setRightChar(correctChars)

        if (inputChar === initialChar) {
          return (
            <span key={index} style={{ color: 'green' }}>
              {char}
            </span>
          )
        }

        setFreez(true)

        return (
          <span key={index} style={{ color: 'red' }}>
            {char}
          </span>
        )
      }
      return char
    })

    setValue(
      <Typography sx={{ fontSize: '23px', fontWeight: 'medium' }}>
        {coloredText}
      </Typography>,
    )
  }

  useEffect(() => {
    console.log(rightChar)
    CarImages.map((value) => {
      console.log(value.margin)
    })
    if (CarImages.some((car) => car.margin >= 540)) {
      const sortedCars = [...CarImages].sort((a, b) => b.rank - a.rank)
      const carWithMargin540 = sortedCars.find(
        (car) => car.margin >= 540 && car.rank <= 0,
      )

      if (carWithMargin540) {
        const newRank = sortedCars[0].rank + 1
        const updatedCarImages = CarImages.map((car) =>
          car === carWithMargin540 ? { ...car, rank: newRank } : car,
        )

        setCarImages(updatedCarImages)
      }
    }
  }, [JSON.stringify(CarImages.map((car) => car.margin))])
  const isFirstRender = useRef(true)
  const [
    sendRankMutation,
    { loading: SendRankLoading, error: SendRankError, data: SendRankData },
  ] = useMutation(SEND_RANK)
  useEffect(() => {
    if (!isFirstRender.current) {
      let Len = Array.from(initialText).length
      const factor = 540 / Len
      const updatedCarImages = CarImages.map((car, index) => ({
        ...car,
        margin: car.ID === user.ID ? rightChar.length * factor : car.margin,
      }))
      setCarImages(updatedCarImages)
      const response = sendRankMutation({
        variables: {
          rankInfo: {
            roomId: id,
            ID: user.ID,
            rank: updatedCarImages.find((value) => value.ID === user.ID).margin,
          },
        }, 
      })
      console.log(rightChar)
    } else {
      isFirstRender.current = false
    }
  }, [rightChar])
  const [
    startuser,
    {
      loading: startRoom_loading,
      error: startRoom_error,
      data: startRoom_data,
    },
  ] = useLazyQuery(START_ROOM)

  const StartROOM = async () => {
    try {
      startuser()
    } catch (error) {
      console.log(error)
    }
  }

  if (CarImages.length == 0) {
    return <CircularProgress />
  }

  return (
    <Grid
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Car images */}
      {CarImages.map(({ uri, margin, username, rank }, index) => (
        <Grid
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '650px',
          }}
        >
          <div>
            <img
              style={{
                width: '90px',
                height: '50px',
                marginLeft: margin,
              }}
              src={uri}
              alt={`Car ${index}`}
              end
            />
            <p style={{ marginTop: -4, marginLeft: margin }}>
              {username == user.username ? 'Me' : username}
            </p>
          </div>

          {/* Placeholder image, replace with your car image */}
          {margin >= 540 ? (
            <Avatar>{rank}</Avatar>
          ) : (
            <img
              style={{ width: '20px' }}
              src={'/static/cars/win.png'}
              alt={`Placeholder ${index}`}
            />
          )}
        </Grid>
      ))}

      {/* Displayed text */}
      <Box
        sx={{
          width: '600px',
          padding: 4,
          borderRadius: '12px',
          border: '1px solid gray',
          mt: 10,
          fontSize: '23px',
        }}
      >
        {value}
      </Box>

      {/* Input field */}
      <Box sx={{ width: '600px', mt: 8 }}>
        <Input
          disabled={initialText == 'Waiting ...'}
          sx={{ fontSize: '23px', fontWeight: 'medium' }}
          fullWidth
          multiline
          onChange={handleInputChange}
        />
      </Box>
      {user.ID === room.owner && (
        <Button onClick={StartROOM} variant="contained" sx={{ mt: 10 }}>
          Start
        </Button>
      )}
    </Grid>
  )
}

export default RacingPage
