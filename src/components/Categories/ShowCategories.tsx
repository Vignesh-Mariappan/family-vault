import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { TypographyH4 } from '../ui/TypographyH4'
import DefaultCategories from './DefaultCategories'
import { useNavigate } from 'react-router-dom'

const ShowCategories = ({ userDisplayName }: {
    userDisplayName: string;
}) => {
    const navigate = useNavigate();
    
  return (
    <>
          <Button
            variant='outline'
            onClick={() => navigate('/')}
            className='mb-4 ml-8 self-start cursor-pointer'

          >
            <ChevronLeft className='h-4 w-4' />
            Back to Home
            {/* Using X as a back arrow, you might replace this */}
          </Button>
          <TypographyH4 text={userDisplayName} />
          <DefaultCategories />
        </>
  )
}

export default ShowCategories