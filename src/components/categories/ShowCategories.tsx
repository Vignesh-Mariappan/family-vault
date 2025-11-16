import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'
import DefaultCategories from './DefaultCategories'
import { useNavigate } from 'react-router-dom'
import { TypographyH2 } from '../ui/TypographyH2'

const ShowCategories = ({ userDisplayName }: {
    userDisplayName: string;
}) => {
    const navigate = useNavigate();
    
  return (
    <>
          <Button
            variant='default'
            onClick={() => navigate('/')}
            className='mb-4 ml-8 self-start cursor-pointer'

          >
            <ChevronLeft className='h-4 w-4' />
            Back to Home
            {/* Using X as a back arrow, you might replace this */}
          </Button>
          <TypographyH2 additionalClasses="text-center mx-auto w-full my-4" text={userDisplayName} />
          <DefaultCategories />
        </>
  )
}

export default ShowCategories